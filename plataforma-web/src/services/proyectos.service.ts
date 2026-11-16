'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';
import { filtroClientes } from '@/lib/tenant';

export async function getProyectos() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    return await prisma.proyectos.findMany({
      where: { inmuebles: { clientes: filtroClientes(ctx) } },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        titulo: true,
        tipo_trabajo: true,
        prioridad: true,
        estado: true,
        fecha_solicitud: true,
        inmuebles: {
          select: {
            nombre_referencia: true,
            direccion: true,
            clientes: { select: { nombre: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    return [];
  }
}

export async function getProyectoPorId(id: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return null;

    // Filtro de pertenencia dentro de la consulta + todo en un solo JOIN
    const proyecto = await prisma.proyectos.findFirst({
      where: { id, inmuebles: { clientes: filtroClientes(ctx) } },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        tipo_trabajo: true,
        estado: true,
        prioridad: true,
        fecha_solicitud: true,
        fecha_inicio: true,
        fecha_termino: true,
        created_at: true,
        tecnico_id: true,
        inmuebles: {
          select: {
            id: true,
            direccion: true,
            comuna: true,
            nombre_referencia: true,
            tipo_uso: true,
            superficie_m2: true,
            antiguedad_anios: true,
            clientes: {
              select: {
                id: true,
                nombre: true,
                rut: true,
                telefono: true,
                email: true,
              },
            },
          },
        },
        perfiles: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
          },
        },
        visitas_tecnicas: {
          select: {
            id: true,
            fecha_programada: true,
            estado: true,
            motivo: true,
            observaciones: true,
            levantamientos: {
              select: {
                id: true,
                tipo_instalacion: true,
                tension_nominal_v: true,
                tipo_empalme: true,
                potencia_contratada_kw: true,
                puesta_tierra: true,
                resistencia_tierra_ohm: true,
                observaciones: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
        cotizaciones: {
          select: {
            id: true,
            numero: true,
            total: true,
            estado: true,
          },
        },
        avances: {
          select: {
            id: true,
            descripcion: true,
            created_at: true,
          },
        },
      },
    });

    if (!proyecto) return null;

    // Proyectos antiguos sin técnico asignado: mostramos el perfil del usuario independiente
    if (!proyecto.perfiles) {
      const perfilIdABuscar = proyecto.tecnico_id || (ctx.esIndependiente ? ctx.perfilId : null);

      if (perfilIdABuscar) {
        const tecnicoAsociado = await prisma.perfiles.findUnique({
          where: { id: perfilIdABuscar },
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
          },
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
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const inmueble_id = formData.get('inmueble_id') as string;
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const tipo_trabajo = formData.get('tipo_trabajo') as string;
    const prioridad = (formData.get('prioridad') as string) || 'normal';
    const estado = (formData.get('estado') as string) || 'solicitado';

    if (!inmueble_id || !titulo) {
      return { success: false, error: 'El inmueble y el título del proyecto son obligatorios.' };
    }

    // El inmueble debe pertenecer a tu empresa / a ti
    const inmuebleValido = await prisma.inmuebles.findFirst({
      where: { id: inmueble_id, clientes: filtroClientes(ctx) },
      select: { id: true },
    });
    if (!inmuebleValido) {
      return { success: false, error: 'El inmueble seleccionado no existe o no tienes acceso.' };
    }

    const fechaChileStr = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Santiago',
    });
    const [anio, mes, dia] = fechaChileStr.split('-').map(Number);
    const fechaSolicitudLocal = new Date(Date.UTC(anio, mes - 1, dia, 12, 0, 0));

    await prisma.proyectos.create({
      data: {
        inmueble_id,
        titulo,
        descripcion: descripcion || null,
        tipo_trabajo: tipo_trabajo || null,
        prioridad,
        estado,
        fecha_solicitud: fechaSolicitudLocal,
        tecnico_id: ctx.perfilId,
      },
    });

    revalidatePath('/dashboard/proyectos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error al crear el proyecto:', error);
    return { success: false, error: error.message || 'No se pudo registrar el proyecto.' };
  }
}

export async function updateProyecto(id: string, formData: FormData) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const inmueble_id = formData.get('inmueble_id') as string;
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const tipo_trabajo = formData.get('tipo_trabajo') as string;
    const prioridad = formData.get('prioridad') as string;
    const estado = formData.get('estado') as string;

    if (!inmueble_id || !titulo) {
      return { success: false, error: 'El inmueble y el título del proyecto son obligatorios.' };
    }

    const inmuebleValido = await prisma.inmuebles.findFirst({
      where: { id: inmueble_id, clientes: filtroClientes(ctx) },
      select: { id: true },
    });
    if (!inmuebleValido) {
      return { success: false, error: 'El inmueble seleccionado no existe o no tienes acceso.' };
    }

    const { count } = await prisma.proyectos.updateMany({
      where: { id, inmuebles: { clientes: filtroClientes(ctx) } },
      data: {
        inmueble_id,
        titulo,
        descripcion: descripcion || null,
        tipo_trabajo: tipo_trabajo || null,
        prioridad,
        estado,
        updated_at: new Date(),
      },
    });

    if (count === 0) {
      return { success: false, error: 'Proyecto no encontrado o sin permisos.' };
    }

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
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const { count } = await prisma.proyectos.deleteMany({
      where: { id, inmuebles: { clientes: filtroClientes(ctx) } },
    });

    if (count === 0) {
      return { success: false, error: 'Proyecto no encontrado o sin permisos.' };
    }

    revalidatePath('/dashboard/proyectos');
    revalidatePath('/dashboard');
    return { success: true, mensaje: 'Proyecto eliminado exitosamente.' };
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return {
        success: false,
        error: 'No se puede eliminar: el proyecto tiene visitas, cotizaciones u otros registros asociados.',
      };
    }
    console.error('Error al eliminar el proyecto:', error);
    return { success: false, error: error.message || 'No se pudo eliminar el proyecto.' };
  }
}

export async function createVisitaTecnica(formData: FormData) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) {
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

    const proyectoValido = await prisma.proyectos.findFirst({
      where: { id: proyecto_id, inmuebles: { clientes: filtroClientes(ctx) } },
      select: { id: true },
    });
    if (!proyectoValido) {
      return { success: false, error: 'Proyecto no encontrado o sin permisos.' };
    }

    await prisma.visitas_tecnicas.create({
      data: {
        proyecto_id,
        tecnico_id: ctx.perfilId,
        fecha_programada: new Date(fecha_programada),
        motivo: motivo || null,
        observaciones: observaciones || null,
        estado,
      },
    });

    revalidatePath(`/dashboard/proyectos/${proyecto_id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error al crear visita técnica:', error);
    return { success: false, error: error.message || 'No se pudo guardar la visita técnica.' };
  }
}

export async function createLevantamiento(formData: FormData) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

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

    const visitaValida = await prisma.visitas_tecnicas.findFirst({
      where: {
        id: visita_id,
        proyectos: { inmuebles: { clientes: filtroClientes(ctx) } },
      },
      select: { id: true },
    });
    if (!visitaValida) {
      return { success: false, error: 'Visita técnica no encontrada o sin permisos.' };
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