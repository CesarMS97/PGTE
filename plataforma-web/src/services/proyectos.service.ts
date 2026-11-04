'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';

export async function getProyectos() {
  try {
    const contexto = await obtenerContextoUsuarioActual();
    if (!contexto) return [];

    const targetEmpresaId = contexto.empresaId || undefined;
    const targetTecnicoId = contexto.esIndependiente ? contexto.perfilId : undefined;

    const whereCondition = targetEmpresaId 
      ? { inmuebles: { clientes: { empresa_id: targetEmpresaId } } } 
      : targetTecnicoId 
      ? { inmuebles: { clientes: { tecnico_id: targetTecnicoId } } } 
      : undefined;

    const proyectos = await prisma.proyectos.findMany({
      where: whereCondition,
      include: {
        inmuebles: {
          include: {
            clientes: true,
          },
        },
        perfiles: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return proyectos;
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    return [];
  }
}

export async function getProyectoPorId(id: string) {
  try {
    const contexto = await obtenerContextoUsuarioActual();
    if (!contexto) return null;

    const proyecto = await prisma.proyectos.findUnique({
      where: { id },
      include: {
        inmuebles: {
          include: {
            clientes: true,
          },
        },
        perfiles: true, 
        visitas_tecnicas: {
          include: {
            levantamientos: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        cotizaciones: true,
        avances: true,
      },
    });

    if (!proyecto) return null;

    // BLINDAJE TÉCNICO: Si el proyecto tiene tecnico_id pero la relación no se cargó, 
    // o si el proyecto es antiguo y no tiene tecnico_id pero el usuario actual es independiente, 
    // asignamos el perfil correspondiente para que la UI lo muestre de inmediato.
    if (!proyecto.perfiles) {
      const perfilIdABuscar = proyecto.tecnico_id || (contexto.esIndependiente ? contexto.perfilId : null);
      
      if (perfilIdABuscar) {
        const tecnicoAsociado = await prisma.perfiles.findUnique({
          where: { id: perfilIdABuscar },
        });
        if (tecnicoAsociado) {
          (proyecto as any).perfiles = tecnicoAsociado;
        }
      }
    }

    return proyecto;
  } catch (error) {
    console.error('Error al obtener el proyecto por ID:', error);
    return null;
  }
}

export async function createProyecto(formData: FormData) {
  try {
    const contexto = await obtenerContextoUsuarioActual();

    const inmueble_id = formData.get('inmueble_id') as string;
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const tipo_trabajo = formData.get('tipo_trabajo') as string;
    const prioridad = (formData.get('prioridad') as string) || 'normal';
    const estado = (formData.get('estado') as string) || 'solicitado';

    if (!inmueble_id || !titulo) {
      return { success: false, error: 'El inmueble y el título del proyecto son obligatorios.' };
    }

    // Manteniendo la fecha exacta tal como la tenías funcionando
    const fechaChileStr = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Santiago',
    });
    const [anio, mes, dia] = fechaChileStr.split('-').map(Number);
    const fechaSolicitudLocal = new Date(Date.UTC(anio, mes - 1, dia, 12, 0, 0));

    // Asignación segura del técnico de la sesión actual
    const tecnicoIdAsignado = contexto?.perfilId || null;

    await prisma.proyectos.create({
      data: {
        inmueble_id,
        titulo,
        descripcion: descripcion || null,
        tipo_trabajo: tipo_trabajo || null,
        prioridad,
        estado,
        fecha_solicitud: fechaSolicitudLocal,
        tecnico_id: tecnicoIdAsignado,
      },
    });

    revalidatePath('/dashboard/proyectos');
    return { success: true };
  } catch (error: any) {
    console.error('Error al crear el proyecto:', error);
    return { success: false, error: error.message || 'No se pudo registrar el proyecto.' };
  }
}

export async function updateProyecto(id: string, formData: FormData) {
  try {
    const inmueble_id = formData.get('inmueble_id') as string;
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const tipo_trabajo = formData.get('tipo_trabajo') as string;
    const prioridad = formData.get('prioridad') as string;
    const estado = formData.get('estado') as string;

    if (!inmueble_id || !titulo) {
      return { success: false, error: 'El inmueble y el título del proyecto son obligatorios.' };
    }

    await prisma.proyectos.update({
      where: { id },
      data: {
        inmueble_id,
        titulo,
        descripcion: descripcion || null,
        tipo_trabajo: tipo_trabajo || null,
        prioridad,
        estado,
      },
    });

    revalidatePath('/dashboard/proyectos');
    revalidatePath(`/dashboard/proyectos/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error al actualizar el proyecto:', error);
    return { success: false, error: error.message || 'No se pudo actualizar el proyecto.' };
  }
}

export async function deleteProyecto(id: string) {
  try {
    await prisma.proyectos.delete({
      where: { id },
    });

    revalidatePath('/dashboard/proyectos');
    return { success: true, mensaje: 'Proyecto eliminado exitosamente.' };
  } catch (error: any) {
    console.error('Error al eliminar el proyecto:', error);
    return { success: false, error: error.message || 'No se pudo eliminar el proyecto.' };
  }
}

export async function createVisitaTecnica(formData: FormData) {
  try {
    const contexto = await obtenerContextoUsuarioActual();
    if (!contexto || !contexto.perfilId) {
      return { success: false, error: 'No se pudo identificar el técnico actual.' };
    }

    const proyecto_id = formData.get('proyecto_id') as string;
    const fecha_programada = formData.get('fecha_programada') as string;
    const motivo = formData.get('motivo') as string;
    const observaciones = formData.get('observaciones') as string;
    const estado = (formData.get('estado') as string) || 'programada';

    if (!proyecto_id || !fecha_programada) {
      return { success: false, error: 'El proyecto y la fecha programada son obligatorios.' };
    }

    await prisma.visitas_tecnicas.create({
      data: {
        proyecto_id,
        tecnico_id: contexto.perfilId,
        fecha_programada: new Date(fecha_programada),
        motivo: motivo || null,
        observaciones: observaciones || null,
        estado,
      },
    });

    revalidatePath(`/dashboard/proyectos/${proyecto_id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error al crear visita técnica:', error);
    return { success: false, error: error.message || 'No se pudo guardar la visita técnica.' };
  }
}

export async function createLevantamiento(formData: FormData) {
  try {
    const proyecto_id = formData.get('proyecto_id') as string;
    const visita_id = formData.get('visita_id') as string;
    const tipo_instalacion = formData.get('tipo_instalacion') as string;
    const tension_nominal_v = formData.get('tension_nominal_v') as string;
    const tipo_empalme = formData.get('tipo_empalme') as string;
    const potencia_contratada_kw = formData.get('potencia_contratada_kw') as string;
    const puesta_tierra = formData.get('puesta_tierra') === 'true';
    const resistencia_tierra_ohm = formData.get('resistencia_tierra_ohm') as string;
    const observaciones = formData.get('observaciones') as string;

    if (!visita_id) {
      return { success: false, error: 'Debe especificar la visita técnica asociada para el levantamiento.' };
    }

    await prisma.levantamientos.create({
      data: {
        visita_id,
        tipo_instalacion: tipo_instalacion || null,
        tension_nominal_v: tension_nominal_v ? parseFloat(tension_nominal_v) : null,
        tipo_empalme: tipo_empalme || null,
        potencia_contratada_kw: potencia_contratada_kw ? parseFloat(potencia_contratada_kw) : null,
        puesta_tierra,
        resistencia_tierra_ohm: resistencia_tierra_ohm ? parseFloat(resistencia_tierra_ohm) : null,
        observaciones: observaciones || null,
      },
    });

    revalidatePath(`/dashboard/proyectos/${proyecto_id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error al crear levantamiento:', error);
    return { success: false, error: error.message || 'No se pudo guardar el levantamiento.' };
  }
}