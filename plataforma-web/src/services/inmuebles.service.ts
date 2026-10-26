'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getInmuebles() {
  try {
    const inmuebles = await prisma.inmuebles.findMany({
      include: {
        clientes: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return inmuebles;
  } catch (error) {
    console.error('Error al obtener los inmuebles:', error);
    return [];
  }
}

export async function getInmueblePorId(id: string) {
  try {
    return await prisma.inmuebles.findUnique({
      where: { id },
      include: {
        clientes: true,
        proyectos: true,
      },
    });
  } catch (error) {
    console.error('Error al obtener el inmueble:', error);
    return null;
  }
}

export async function createInmueble(formData: FormData) {
  const cliente_id = formData.get('cliente_id') as string;
  const nombre_referencia = formData.get('nombre_referencia') as string;
  const direccion = formData.get('direccion') as string;
  const comuna = formData.get('comuna') as string;
  const region = formData.get('region') as string;
  const tipo_uso = formData.get('tipo_uso') as string;
  const material_construccion = formData.get('material_construccion') as string;
  const superficie_m2 = formData.get('superficie_m2') as string;
  const antiguedad_anios = formData.get('antiguedad_anios') as string;
  const observaciones = formData.get('observaciones') as string;

  if (!direccion || !comuna || !cliente_id) {
    throw new Error('La dirección, la comuna y el cliente son obligatorios.');
  }

  try {
    await prisma.inmuebles.create({
      data: {
        cliente_id,
        nombre_referencia: nombre_referencia || null,
        direccion,
        comuna,
        region: region || null,
        tipo_uso: tipo_uso || null,
        material_construccion: material_construccion || null,
        superficie_m2: superficie_m2 ? parseFloat(superficie_m2) : null,
        antiguedad_anios: antiguedad_anios ? parseInt(antiguedad_anios, 10) : null,
        observaciones: observaciones || null,
        activo: true,
      },
    });
  } catch (error) {
    console.error('Error al crear el inmueble:', error);
    throw new Error('No se pudo registrar el inmueble en la base de datos.');
  }

  revalidatePath('/dashboard/inmuebles');
  redirect('/dashboard/inmuebles');
}

export async function updateInmueble(id: string, formData: FormData) {
  const cliente_id = formData.get('cliente_id') as string;
  const nombre_referencia = formData.get('nombre_referencia') as string;
  const direccion = formData.get('direccion') as string;
  const comuna = formData.get('comuna') as string;
  const region = formData.get('region') as string;
  const tipo_uso = formData.get('tipo_uso') as string;
  const material_construccion = formData.get('material_construccion') as string;
  const superficie_m2 = formData.get('superficie_m2') as string;
  const antiguedad_anios = formData.get('antiguedad_anios') as string;
  const observaciones = formData.get('observaciones') as string;
  const activo = formData.get('activo') === 'on';

  if (!direccion || !comuna || !cliente_id) {
    throw new Error('La dirección, la comuna y el cliente son obligatorios.');
  }

  try {
    await prisma.inmuebles.update({
      where: { id },
      data: {
        cliente_id,
        nombre_referencia: nombre_referencia || null,
        direccion,
        comuna,
        region: region || null,
        tipo_uso: tipo_uso || null,
        material_construccion: material_construccion || null,
        superficie_m2: superficie_m2 ? parseFloat(superficie_m2) : null,
        antiguedad_anios: antiguedad_anios ? parseInt(antiguedad_anios, 10) : null,
        observaciones: observaciones || null,
        activo,
      },
    });
  } catch (error) {
    console.error('Error al actualizar el inmueble:', error);
    throw new Error('No se pudo actualizar el inmueble.');
  }

  revalidatePath('/dashboard/inmuebles');
  revalidatePath(`/dashboard/inmuebles/${id}`);
  redirect('/dashboard/inmuebles');
}

export async function deleteInmueble(id: string) {
  try {
    // Validar si tiene proyectos asociados antes de eliminar
    const cantidadProyectos = await prisma.proyectos.count({
      where: { inmueble_id: id },
    });

    if (cantidadProyectos > 0) {
      return {
        success: false,
        error: `No se puede eliminar: el inmueble tiene ${cantidadProyectos} proyecto(s) asociado(s).`,
      };
    }

    await prisma.inmuebles.delete({
      where: { id },
    });

    revalidatePath('/dashboard/inmuebles');
    return { success: true, mensaje: 'Inmueble eliminado exitosamente.' };
  } catch (error) {
    console.error('Error al eliminar el inmueble:', error);
    return { success: false, error: 'No se pudo eliminar el inmueble de la base de datos.' };
  }
}