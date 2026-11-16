'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';
import { filtroClientes } from '@/lib/tenant';

// Lee y normaliza los campos del formulario de inmuebles
function leerFormulario(formData: FormData) {
  const texto = (campo: string) => {
    const valor = formData.get(campo);
    return typeof valor === 'string' ? valor.trim() : '';
  };

  const superficieTxt = texto('superficie_m2').replace(',', '.');
  const antiguedadTxt = texto('antiguedad_anios');
  const superficie = superficieTxt ? Number(superficieTxt) : NaN;
  const antiguedad = antiguedadTxt ? parseInt(antiguedadTxt, 10) : NaN;

  return {
    cliente_id: texto('cliente_id'),
    nombre_referencia: texto('nombre_referencia') || null,
    tipo_uso: texto('tipo_uso') || null,
    direccion: texto('direccion'),
    comuna: texto('comuna'),
    region: texto('region') || null,
    material_construccion: texto('material_construccion') || null,
    superficie_m2: Number.isNaN(superficie) ? null : superficie,
    antiguedad_anios: Number.isNaN(antiguedad) ? null : antiguedad,
    observaciones: texto('observaciones') || null,
  };
}

export async function getInmuebles() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    return await prisma.inmuebles.findMany({
      where: { clientes: filtroClientes(ctx) },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        direccion: true,
        comuna: true,
        tipo_uso: true,
        clientes: { select: { id: true, nombre: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error al obtener los inmuebles:', error);
    return [];
  }
}

// Sirve a la ficha, al formulario de edición y a la validación de pertenencia
export async function getInmueblePorId(id: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return null;

    return await prisma.inmuebles.findFirst({
      where: { id, clientes: filtroClientes(ctx) },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        cliente_id: true,
        nombre_referencia: true,
        tipo_uso: true,
        direccion: true,
        comuna: true,
        region: true,
        material_construccion: true,
        superficie_m2: true,
        antiguedad_anios: true,
        activo: true,
        observaciones: true,
        clientes: { select: { id: true, nombre: true } },
      },
    });
  } catch (error) {
    console.error('Error al obtener el inmueble por ID:', error);
    return null;
  }
}

// Selector en cascada Cliente → Inmueble del formulario de proyectos
export async function getInmueblesParaProyecto() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    return await prisma.inmuebles.findMany({
      where: { clientes: filtroClientes(ctx) },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        nombre_referencia: true,
        direccion: true,
        comuna: true,
        clientes: { select: { id: true, nombre: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error al obtener inmuebles para proyectos:', error);
    return [];
  }
}

// Se usa como action de <form>: redirige al terminar y lanza error si algo falla
export async function createInmueble(formData: FormData): Promise<void> {
  const ctx = await obtenerContextoUsuarioActual();
  if (!ctx) redirect('/login');

  const datos = leerFormulario(formData);
  if (!datos.cliente_id || !datos.direccion || !datos.comuna) {
    throw new Error('Cliente, dirección y comuna son obligatorios.');
  }

  
  const clienteValido = await prisma.clientes.findFirst({
    where: { id: datos.cliente_id, ...filtroClientes(ctx) },
    select: { id: true },
  });
  if (!clienteValido) {
    throw new Error('El cliente seleccionado no existe o no tienes acceso.');
  }

  await prisma.inmuebles.create({ data: datos });

  revalidatePath('/dashboard/inmuebles');
  revalidatePath('/dashboard');
  redirect('/dashboard/inmuebles');
}

export async function updateInmueble(id: string, formData: FormData): Promise<void> {
  const ctx = await obtenerContextoUsuarioActual();
  if (!ctx) redirect('/login');

  const datos = leerFormulario(formData);
  if (!datos.cliente_id || !datos.direccion || !datos.comuna) {
    throw new Error('Cliente, dirección y comuna son obligatorios.');
  }

  const clienteValido = await prisma.clientes.findFirst({
    where: { id: datos.cliente_id, ...filtroClientes(ctx) },
    select: { id: true },
  });
  if (!clienteValido) {
    throw new Error('El cliente seleccionado no existe o no tienes acceso.');
  }

  const { count } = await prisma.inmuebles.updateMany({
    where: { id, clientes: filtroClientes(ctx) },
    data: {
      ...datos,
      activo: formData.get('activo') === 'on',
      updated_at: new Date(),
    },
  });

  if (count === 0) {
    throw new Error('Inmueble no encontrado o sin permisos.');
  }

  revalidatePath('/dashboard/inmuebles');
  revalidatePath(`/dashboard/inmuebles/${id}`);
  redirect(`/dashboard/inmuebles/${id}`);
}

export async function deleteInmueble(id: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const { count } = await prisma.inmuebles.deleteMany({
      where: { id, clientes: filtroClientes(ctx) },
    });

    if (count === 0) {
      return { success: false, error: 'Inmueble no encontrado o sin permisos.' };
    }

    revalidatePath('/dashboard/inmuebles');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return {
        success: false,
        error: 'No se puede eliminar: el inmueble tiene proyectos asociados.',
      };
    }
    console.error('Error al eliminar el inmueble:', error);
    return { success: false, error: error.message || 'No se pudo eliminar el inmueble.' };
  }
}