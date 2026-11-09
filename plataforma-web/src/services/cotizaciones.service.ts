'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';

export async function getOrCreateCotizacionForProject(proyectoId: string) {
  const supabase = await createClient();

  let { data: cotizacion } = await supabase
    .from('cotizaciones')
    .select('*, cotizacion_items(*)')
    .eq('proyecto_id', proyectoId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!cotizacion) {
    const numeroFolio = `COT-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: nuevaCotizacion, error: insertError } = await supabase
      .from('cotizaciones')
      .insert({
        proyecto_id: proyectoId,
        numero: numeroFolio,
        version: 1,
        estado: 'borrador',
        subtotal_materiales: 0,
        subtotal_mano_obra: 0,
        otros_costos: 0,
        utilidad_porcentaje: 0,
        utilidad_monto: 0,
        impuestos_monto: 0,
        total: 0,
      })
      .select('*, cotizacion_items(*)')
      .single();

    if (insertError) {
      throw new Error(`Error al crear la cotización: ${insertError.message}`);
    }
    cotizacion = nuevaCotizacion;
  }

  return cotizacion;
}

export async function agregarItemCotizacion(formData: {
  cotizacionId: string;
  proyectoId: string;
  tipo: string;
  descripcion: string;
  cantidad: number;
  unidad?: string;
  precioUnitario: number;
  observaciones?: string;
}) {
  const supabase = await createClient();
  const subtotalItem = formData.cantidad * formData.precioUnitario;

  const { data: itemCreado, error: itemError } = await supabase
    .from('cotizacion_items')
    .insert({
      cotizacion_id: formData.cotizacionId,
      tipo: formData.tipo,
      descripcion: formData.descripcion,
      cantidad: formData.cantidad,
      unidad: formData.unidad || 'global',
      precio_unitario: formData.precioUnitario,
      subtotal: subtotalItem,
      observaciones: formData.observaciones,
    })
    .select()
    .single();

  if (itemError) {
    return { success: false, error: itemError.message };
  }

  await recalcularTotalesCotizacion(formData.cotizacionId);
  return { success: true, item: itemCreado };
}

export async function eliminarItemCotizacion(itemId: string, cotizacionId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cotizacion_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    return { success: false, error: error.message };
  }

  await recalcularTotalesCotizacion(cotizacionId);
  return { success: true };
}

export async function finalizarCotizacion(cotizacionId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cotizaciones')
    .update({
      estado: 'enviada',
      fecha_emision: new Date().toISOString().split('T')[0],
    })
    .eq('id', cotizacionId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

async function recalcularTotalesCotizacion(cotizacionId: string) {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('cotizacion_items')
    .select('*')
    .eq('cotizacion_id', cotizacionId);

  if (!items) return;

  let subtotalMateriales = 0;
  let subtotalManoObra = 0;
  let otrosCostos = 0;

  items.forEach((item) => {
    const sub = Number(item.subtotal || 0);
    if (item.tipo === 'material') {
      subtotalMateriales += sub;
    } else if (item.tipo === 'mano_obra') {
      subtotalManoObra += sub;
    } else {
      otrosCostos += sub;
    }
  });

  const subtotalGeneral = subtotalMateriales + subtotalManoObra + otrosCostos;
  const impuestosMonto = subtotalGeneral * 0.19;
  const totalGeneral = subtotalGeneral + impuestosMonto;

  await supabase
    .from('cotizaciones')
    .update({
      subtotal_materiales: subtotalMateriales,
      subtotal_mano_obra: subtotalManoObra,
      otros_costos: otrosCostos,
      impuestos_monto: impuestosMonto,
      total: totalGeneral,
    })
    .eq('id', cotizacionId);
}

export async function getProyectosParaCotizar() {
  try {
    const contexto = await obtenerContextoUsuarioActual();
    if (!contexto) return [];

    const targetEmpresaId = contexto.empresaId || undefined;
    const targetTecnicoId = contexto.esIndependiente ? contexto.perfilId : undefined;

    const whereCondition = targetEmpresaId 
      ? { visitas_tecnicas: { proyectos: { inmuebles: { clientes: { empresa_id: targetEmpresaId } } } } } 
      : targetTecnicoId 
      ? { visitas_tecnicas: { proyectos: { inmuebles: { clientes: { tecnico_id: targetTecnicoId } } } } } 
      : undefined;

    const levantamientos = await prisma.levantamientos.findMany({
      where: whereCondition,
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
      orderBy: {
        created_at: 'desc',
      },
    });

    return levantamientos.map((lev) => ({
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