'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';
import { filtroClientes, type ContextoTenant } from '@/lib/tenant';

export interface GuardarLevantamientoInput {
  visitaId: string;
  tipoInstalacion?: string;
  tipoEmpalme?: string;
  tensionNominalV?: string | number;
  potenciaContratadaKw?: string | number;
  puestaTierra?: boolean;
  resistenciaTierraOhm?: string | number;
  observaciones?: string;
}

function parseDecimalValue(val?: string | number): number | null {
  if (val === undefined || val === null || val === '') return null;
  const parsed = typeof val === 'number' ? val : parseFloat(val.toString().replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

function sanitizeData(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (typeof obj === 'object' && typeof obj.toNumber === 'function') {
    return obj.toNumber();
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeData(item));
  }
  if (typeof obj === 'object') {
    const clone: any = {};
    for (const key of Object.keys(obj)) {
      clone[key] = sanitizeData(obj[key]);
    }
    return clone;
  }
  return obj;
}

// La visita debe pertenecer a tu empresa / a ti
async function visitaPermitida(ctx: ContextoTenant, visitaId: string) {
  const visita = await prisma.visitas_tecnicas.findFirst({
    where: {
      id: visitaId,
      proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
    },
    select: { id: true },
  });
  return !!visita;
}

export async function autoguardarLevantamiento(data: GuardarLevantamientoInput) {
  try {
    if (!data.visitaId) {
      return { success: false, error: 'Falta el ID de la visita técnica' };
    }

    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No autorizado' };

    if (!(await visitaPermitida(ctx, data.visitaId))) {
      return { success: false, error: 'Visita técnica no encontrada o sin permisos' };
    }

    const tension = parseDecimalValue(data.tensionNominalV);
    const potencia = parseDecimalValue(data.potenciaContratadaKw);
    const resistencia = parseDecimalValue(data.resistenciaTierraOhm);

    const levantamiento = await prisma.levantamientos.upsert({
      where: {
        visita_id: data.visitaId,
      },
      update: {
        tipo_instalacion: data.tipoInstalacion || null,
        tipo_empalme: data.tipoEmpalme || null,
        tension_nominal_v: tension,
        potencia_contratada_kw: potencia,
        puesta_tierra: data.puestaTierra ?? null,
        resistencia_tierra_ohm: resistencia,
        observaciones: data.observaciones || null,
        updated_at: new Date(),
      },
      create: {
        visita_id: data.visitaId,
        tipo_instalacion: data.tipoInstalacion || null,
        tipo_empalme: data.tipoEmpalme || null,
        tension_nominal_v: tension,
        potencia_contratada_kw: potencia,
        puesta_tierra: data.puestaTierra ?? null,
        resistencia_tierra_ohm: resistencia,
        observaciones: data.observaciones || null,
      },
    });

    return { success: true, data: sanitizeData(levantamiento) };
  } catch (error) {
    console.error('Error en autoguardarLevantamiento:', error);
    return { success: false, error: 'Error al autoguardar el borrador' };
  }
}

export async function obtenerLevantamientoPorVisita(visitaId: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No autorizado' };

    // El filtro de pertenencia va dentro de la misma consulta (sin viaje extra)
    const levantamiento = await prisma.levantamientos.findFirst({
      where: {
        visita_id: visitaId,
        visitas_tecnicas: {
          proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
        },
      },
    });
    return { success: true, data: sanitizeData(levantamiento) };
  } catch (error) {
    console.error('Error al obtener levantamiento:', error);
    return { success: false, error: 'Error al cargar el levantamiento' };
  }
}

export async function finalizarLevantamiento(data: GuardarLevantamientoInput) {
  try {
    // autoguardar ya valida la sesión y la pertenencia de la visita
    const res = await autoguardarLevantamiento(data);
    if (!res.success || !res.data) return res;

    await prisma.visitas_tecnicas.update({
      where: { id: data.visitaId },
      data: { estado: 'completada' },
    });

    revalidatePath('/dashboard/levantamientos');
    revalidatePath('/dashboard');
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Error en finalizarLevantamiento:', error);
    return { success: false, error: 'Error al finalizar el levantamiento' };
  }
}

export async function obtenerVisitasDelDia() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, data: [] };

    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const visitas = await prisma.visitas_tecnicas.findMany({
      where: {
        tecnico_id: ctx.perfilId,
        estado: { not: 'completada' },
        fecha_programada: {
          gte: hoyInicio,
          lte: hoyFin,
        },
      },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        fecha_programada: true,
        estado: true,
        motivo: true,
        observaciones: true,
        proyectos: {
          select: {
            id: true,
            titulo: true,
            tipo_trabajo: true,
            inmuebles: {
              select: {
                id: true,
                direccion: true,
                comuna: true,
                nombre_referencia: true,
                clientes: {
                  select: {
                    id: true,
                    nombre: true,
                    telefono: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { success: true, data: sanitizeData(visitas) };
  } catch (error) {
    console.error('Error al obtener visitas del día:', error);
    return { success: false, data: [] };
  }
}

export async function obtenerClientesFiltro() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, data: [] };

    const clientes = await prisma.clientes.findMany({
      where: { activo: true, ...filtroClientes(ctx) },
      select: {
        id: true,
        nombre: true,
        rut: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return { success: true, data: sanitizeData(clientes) };
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return { success: false, data: [] };
  }
}

export async function obtenerInmueblesPorCliente(clienteId: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, data: [] };

    const inmuebles = await prisma.inmuebles.findMany({
      where: {
        cliente_id: clienteId,
        activo: true,
        clientes: filtroClientes(ctx),
      },
      select: {
        id: true,
        direccion: true,
        comuna: true,
        nombre_referencia: true,
      },
      orderBy: { direccion: 'asc' },
    });

    return { success: true, data: sanitizeData(inmuebles) };
  } catch (error) {
    console.error('Error al obtener inmuebles:', error);
    return { success: false, data: [] };
  }
}

export async function obtenerVisitasPorInmueble(inmuebleId: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, data: [] };

    // Una sola consulta (antes eran dos en serie: proyectos y luego visitas)
    const visitas = await prisma.visitas_tecnicas.findMany({
      where: {
        proyectos: {
          inmueble_id: inmuebleId,
          inmuebles: { clientes: filtroClientes(ctx) },
        },
      },
      select: {
        id: true,
        fecha_programada: true,
        estado: true,
        motivo: true,
      },
      orderBy: { fecha_programada: 'desc' },
    });

    return { success: true, data: sanitizeData(visitas) };
  } catch (error) {
    console.error('Error al obtener visitas por inmueble:', error);
    return { success: false, data: [] };
  }
}

export async function obtenerHistorialLevantamientos() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, data: [] };

    const levantamientos = await prisma.levantamientos.findMany({
      where: {
        visitas_tecnicas: {
          tecnico_id: ctx.perfilId,
        },
      },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        visita_id: true,
        tipo_instalacion: true,
        tipo_empalme: true,
        tension_nominal_v: true,
        potencia_contratada_kw: true,
        updated_at: true,
        visitas_tecnicas: {
          select: {
            id: true,
            fecha_programada: true,
            estado: true,
            proyectos: {
              select: {
                id: true,
                titulo: true,
                inmuebles: {
                  select: {
                    id: true,
                    direccion: true,
                    nombre_referencia: true,
                    clientes: {
                      select: {
                        id: true,
                        nombre: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    return { success: true, data: sanitizeData(levantamientos) };
  } catch (error) {
    console.error('Error al obtener historial de levantamientos:', error);
    return { success: false, data: [] };
  }
}

// Una sola llamada desde el navegador: las 3 consultas corren en paralelo en el servidor
export async function obtenerDatosInicialesLevantamientos() {
  const [visitas, clientes, historial] = await Promise.all([
    obtenerVisitasDelDia(),
    obtenerClientesFiltro(),
    obtenerHistorialLevantamientos(),
  ]);

  return {
    visitasDelDia: visitas.data as any[],
    clientes: clientes.data as any[],
    historial: historial.data as any[],
  };
}