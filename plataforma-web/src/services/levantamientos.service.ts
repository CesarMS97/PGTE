'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

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

/**
 * Función recursiva universal para sanitizar objetos de Prisma (Convierte Decimals y BigInts a valores planos)
 */
function sanitizeData(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  
  // Si es un Decimal de Prisma (tiene la función toNumber)
  if (typeof obj === 'object' && typeof obj.toNumber === 'function') {
    return obj.toNumber();
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item));
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

/**
 * Server Action para el autoguardado en borrador (Upsert)
 */
export async function autoguardarLevantamiento(data: GuardarLevantamientoInput) {
  try {
    if (!data.visitaId) {
      return { success: false, error: 'Falta el ID de la visita técnica' };
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

/**
 * Server Action para obtener un levantamiento por el ID de la visita
 */
export async function obtenerLevantamientoPorVisita(visitaId: string) {
  try {
    const levantamiento = await prisma.levantamientos.findUnique({
      where: { visita_id: visitaId },
    });
    return { success: true, data: sanitizeData(levantamiento) };
  } catch (error) {
    console.error('Error al obtener levantamiento:', error);
    return { success: false, error: 'Error al cargar el levantamiento' };
  }
}

/**
 * Server Action para finalizar definitivamente el levantamiento
 */
export async function finalizarLevantamiento(data: GuardarLevantamientoInput) {
  try {
    const res = await autoguardarLevantamiento(data);
    if (!res.success || !res.data) return res;

    revalidatePath('/dashboard/levantamientos');
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Error en finalizarLevantamiento:', error);
    return { success: false, error: 'Error al finalizar el levantamiento' };
  }
}

/**
 * Obtiene las visitas técnicas programadas para el día de hoy del técnico autenticado
 */
export async function obtenerVisitasDelDia() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const visitas = await prisma.visitas_tecnicas.findMany({
      where: {
        ...(user ? { tecnico_id: user.id } : {}),
        fecha_programada: {
          gte: hoyInicio,
          lte: hoyFin,
        },
      },
      include: {
        proyectos: {
          include: {
            inmuebles: {
              include: {
                clientes: true,
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

/**
 * Obtiene únicamente los clientes asociados al técnico o empresa autenticada
 */
export async function obtenerClientesFiltro() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let filtroWhere: any = { activo: true };

    if (user) {
      const perfil = await prisma.perfiles.findUnique({
        where: { id: user.id },
      });

      if (perfil) {
        if (perfil.empresa_id) {
          filtroWhere.empresa_id = perfil.empresa_id;
        } else {
          filtroWhere.tecnico_id = user.id;
        }
      }
    }

    const clientes = await prisma.clientes.findMany({
      where: filtroWhere,
      orderBy: { nombre: 'asc' },
    });

    return { success: true, data: sanitizeData(clientes) };
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return { success: false, data: [] };
  }
}

/**
 * Obtiene los inmuebles de un cliente específico
 */
export async function obtenerInmueblesPorCliente(clienteId: string) {
  try {
    const inmuebles = await prisma.inmuebles.findMany({
      where: { cliente_id: clienteId, activo: true },
      orderBy: { direccion: 'asc' },
    });

    return { success: true, data: sanitizeData(inmuebles) };
  } catch (error) {
    console.error('Error al obtener inmuebles:', error);
    return { success: false, data: [] };
  }
}

/**
 * Obtiene las visitas técnicas asociadas a los proyectos de un inmueble específico
 */
export async function obtenerVisitasPorInmueble(inmuebleId: string) {
  try {
    const proyectos = await prisma.proyectos.findMany({
      where: { inmueble_id: inmuebleId },
      select: { id: true },
    });

    const proyectoIds = proyectos.map((p) => p.id);

    if (proyectoIds.length === 0) return { success: true, data: [] };

    const visitas = await prisma.visitas_tecnicas.findMany({
      where: {
        proyecto_id: { in: proyectoIds },
      },
      orderBy: { fecha_programada: 'desc' },
    });

    return { success: true, data: sanitizeData(visitas) };
  } catch (error) {
    console.error('Error al obtener visitas por inmueble:', error);
    return { success: false, data: [] };
  }
}

/**
 * Obtiene el historial general de todos los levantamientos registrados del técnico/empresa
 */
export async function obtenerHistorialLevantamientos() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const levantamientos = await prisma.levantamientos.findMany({
      where: user ? {
        visitas_tecnicas: {
          tecnico_id: user.id
        }
      } : {},
      include: {
        visitas_tecnicas: {
          include: {
            proyectos: {
              include: {
                inmuebles: {
                  include: {
                    clientes: true,
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