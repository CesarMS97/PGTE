'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';
import { filtroClientes } from '@/lib/tenant';

const TIPOS_ITEM = ['material', 'mano_obra', 'otro'];

// Los Decimal de Prisma no pueden viajar a componentes cliente: se pasan a número
function serializarItem(item: {
  id: string;
  tipo: string;
  descripcion: string;
  cantidad: any;
  unidad: string | null;
  precio_unitario: any;
  subtotal: any;
  observaciones: string | null;
}) {
  return {
    id: item.id,
    tipo: item.tipo,
    descripcion: item.descripcion,
    cantidad: Number(item.cantidad),
    unidad: item.unidad,
    precio_unitario: Number(item.precio_unitario),
    subtotal: Number(item.subtotal),
    observaciones: item.observaciones,
  };
}

// Recalcula los totales de una cotización en UNA sola sentencia SQL
function recalcularTotales(cotizacionId: string) {
  return prisma.$executeRaw`
    UPDATE public.cotizaciones c
    SET subtotal_materiales = t.mat,
        subtotal_mano_obra  = t.mo,
        otros_costos        = t.otros,
        impuestos_monto     = ROUND((t.mat + t.mo + t.otros) * 0.19, 2),
        total               = ROUND((t.mat + t.mo + t.otros) * 1.19, 2)
    FROM (
      SELECT
        COALESCE(SUM(subtotal) FILTER (WHERE tipo = 'material'), 0) AS mat,
        COALESCE(SUM(subtotal) FILTER (WHERE tipo = 'mano_obra'), 0) AS mo,
        COALESCE(SUM(subtotal) FILTER (WHERE tipo NOT IN ('material', 'mano_obra')), 0) AS otros
      FROM public.cotizacion_items
      WHERE cotizacion_id = ${cotizacionId}::uuid
    ) t
    WHERE c.id = ${cotizacionId}::uuid`;
}

// Listado de cotizaciones (una sola consulta con JOIN)
export async function getCotizaciones() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    const filas = await prisma.cotizaciones.findMany({
      where: { proyectos: { inmuebles: { clientes: filtroClientes(ctx) } } },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        numero: true,
        estado: true,
        total: true,
        proyecto_id: true,
        proyectos: {
          select: {
            titulo: true,
            inmuebles: {
              select: {
                direccion: true,
                comuna: true,
                clientes: { select: { nombre: true, telefono: true } },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return filas.map((f) => ({ ...f, total: Number(f.total) }));
  } catch (error) {
    console.error('Error al obtener las cotizaciones:', error);
    return [];
  }
}

// Levantamientos disponibles para el selector del modal
export async function getProyectosParaCotizar() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    const levs = await prisma.levantamientos.findMany({
      where: {
        visitas_tecnicas: {
          proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
        },
      },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        tipo_instalacion: true,
        visitas_tecnicas: {
          select: {
            proyecto_id: true,
            proyectos: {
              select: {
                titulo: true,
                inmuebles: {
                  select: {
                    comuna: true,
                    clientes: { select: { nombre: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return levs.map((lev) => ({
      id: lev.id,
      tipo_instalacion: lev.tipo_instalacion,
      proyecto_id: lev.visitas_tecnicas?.proyecto_id || null,
      proyecto_titulo: lev.visitas_tecnicas?.proyectos?.titulo || 'Sin proyecto',
      cliente_nombre: lev.visitas_tecnicas?.proyectos?.inmuebles?.clientes?.nombre || 'Cliente N/A',
      inmueble_comuna: lev.visitas_tecnicas?.proyectos?.inmuebles?.comuna || 'Sin comuna',
    }));
  } catch (error) {
    console.error('Error al obtener levantamientos para cotizar:', error);
    return [];
  }
}

// Proyecto + cliente + inmueble + levantamiento técnico + última cotización con ítems en UNA consulta.
export async function obtenerOCrearCotizacion(proyectoId: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return null;

    const proyecto = await prisma.proyectos.findFirst({
      where: { id: proyectoId, inmuebles: { clientes: filtroClientes(ctx) } },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        titulo: true,
        inmuebles: {
          select: {
            direccion: true,
            comuna: true,
            nombre_referencia: true,
            clientes: { select: { id: true, nombre: true, telefono: true } },
          },
        },
        visitas_tecnicas: {
          select: {
            levantamientos: {
              select: {
                tipo_instalacion: true,
                tipo_empalme: true,
                tension_nominal_v: true,
                potencia_contratada_kw: true,
                puesta_tierra: true,
                resistencia_tierra_ohm: true,
                observaciones: true,
              },
            },
          },
        },
        cotizaciones: {
          orderBy: { created_at: 'desc' },
          take: 1,
          include: { cotizacion_items: { orderBy: { created_at: 'asc' } } },
        },
      },
    });

    if (!proyecto) return null;

    let cot = proyecto.cotizaciones[0];

    if (!cot) {
      const numero = `COT-${Math.floor(1000 + Math.random() * 9000)}`;
      cot = await prisma.cotizaciones.create({
        data: {
          proyecto_id: proyecto.id,
          numero,
          version: 1,
          estado: 'borrador',
        },
        include: { cotizacion_items: true },
      });
    }

    const inmueble = proyecto.inmuebles ?? null;
    const cliente = inmueble?.clientes ?? null;

    const levantamientoRaw = proyecto.visitas_tecnicas?.[0]?.levantamientos ?? null;
    const levantamiento = levantamientoRaw ? {
      tipo_instalacion: levantamientoRaw.tipo_instalacion,
      tipo_empalme: levantamientoRaw.tipo_empalme,
      tension_nominal_v: levantamientoRaw.tension_nominal_v ? Number(levantamientoRaw.tension_nominal_v) : null,
      potencia_contratada_kw: levantamientoRaw.potencia_contratada_kw ? Number(levantamientoRaw.potencia_contratada_kw) : null,
      puesta_tierra: levantamientoRaw.puesta_tierra,
      resistencia_tierra_ohm: levantamientoRaw.resistencia_tierra_ohm ? Number(levantamientoRaw.resistencia_tierra_ohm) : null,
      observaciones: levantamientoRaw.observaciones,
    } : null;

    return {
      proyectoTitulo: proyecto.titulo,
      clienteNombre: cliente?.nombre ?? 'N/A',
      clienteTelefono: cliente?.telefono ?? null,
      inmuebleDireccion: inmueble?.direccion ?? 'Dirección no especificada',
      inmuebleComuna: inmueble?.comuna ?? 'Sin comuna',
      inmuebleReferencia: inmueble?.nombre_referencia ?? null,
      levantamiento,
      cotizacion: {
        id: cot.id,
        proyecto_id: cot.proyecto_id,
        numero: cot.numero,
        version: cot.version,
        estado: cot.estado,
        subtotal_materiales: Number(cot.subtotal_materiales),
        subtotal_mano_obra: Number(cot.subtotal_mano_obra),
        otros_costos: Number(cot.otros_costos),
        impuestos_monto: Number(cot.impuestos_monto),
        total: Number(cot.total),
        cotizacion_items: cot.cotizacion_items.map(serializarItem),
        proyectos: {
          titulo: proyecto.titulo,
          inmuebles: inmueble,
        },
      },
    };
  } catch (error) {
    console.error('Error al obtener o crear la cotización:', error);
    return null;
  }
}

export async function agregarItemCotizacion(formData: {
  cotizacionId: string;
  proyectoId?: string;
  tipo: string;
  descripcion: string;
  cantidad: number;
  unidad?: string;
  precioUnitario: number;
  observaciones?: string;
}) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const descripcion = formData.descripcion?.trim();
    const cantidad = Number(formData.cantidad);
    const precio = Number(formData.precioUnitario);

    if (!descripcion) return { success: false, error: 'La descripción es obligatoria.' };
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return { success: false, error: 'La cantidad debe ser mayor a 0.' };
    }
    if (!Number.isFinite(precio) || precio < 0) {
      return { success: false, error: 'El precio unitario no es válido.' };
    }

    const cotizacionValida = await prisma.cotizaciones.findFirst({
      where: {
        id: formData.cotizacionId,
        proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
      },
      select: { id: true },
    });
    if (!cotizacionValida) {
      return { success: false, error: 'Cotización no encontrada o sin permisos.' };
    }

    const tipo = TIPOS_ITEM.includes(formData.tipo) ? formData.tipo : 'otro';

    const [item] = await prisma.$transaction([
      prisma.cotizacion_items.create({
        data: {
          cotizacion_id: formData.cotizacionId,
          tipo,
          descripcion,
          cantidad,
          unidad: formData.unidad || 'global',
          precio_unitario: precio,
          subtotal: Math.round(cantidad * precio * 100) / 100,
          observaciones: formData.observaciones || null,
        },
      }),
      recalcularTotales(formData.cotizacionId),
    ]);

    return { success: true, item: serializarItem(item) };
  } catch (error: any) {
    console.error('Error al agregar el ítem:', error);
    return { success: false, error: error.message || 'No se pudo agregar el ítem.' };
  }
}

export async function eliminarItemCotizacion(itemId: string, cotizacionId: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const { count } = await prisma.cotizacion_items.deleteMany({
      where: {
        id: itemId,
        cotizacion_id: cotizacionId,
        cotizaciones: {
          proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
        },
      },
    });

    if (count === 0) {
      return { success: false, error: 'Ítem no encontrado o sin permisos.' };
    }

    await recalcularTotales(cotizacionId);
    return { success: true };
  } catch (error: any) {
    console.error('Error al eliminar el ítem:', error);
    return { success: false, error: error.message || 'No se pudo eliminar el ítem.' };
  }
}

export async function finalizarCotizacion(cotizacionId: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const { count } = await prisma.cotizaciones.updateMany({
      where: {
        id: cotizacionId,
        proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
      },
      data: { estado: 'generada', fecha_emision: new Date() },
    });

    if (count === 0) {
      return { success: false, error: 'Cotización no encontrada o sin permisos.' };
    }

    revalidatePath('/dashboard/cotizaciones');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error al finalizar la cotización:', error);
    return { success: false, error: error.message || 'No se pudo finalizar la cotización.' };
  }
}