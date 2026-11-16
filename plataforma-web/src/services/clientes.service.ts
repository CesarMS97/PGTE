'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';
import { filtroClientes } from '@/lib/tenant';
import { clienteSchema } from '@/schemas/cliente.schema';

// Valida con el schema zod (RUT, teléfono, email) y limpia los datos.
// Ignora cualquier campo extra (por ejemplo empresa_id enviado desde el navegador).
function parsearCliente(data: Record<string, any>) {
  const resultado = clienteSchema.safeParse(data);
  if (!resultado.success) {
    return {
      ok: false as const,
      error: resultado.error.issues[0]?.message ?? 'Datos del cliente no válidos.',
    };
  }

  const d = resultado.data;
  const nombre = d.nombre.trim();
  if (!nombre) {
    return { ok: false as const, error: 'El nombre es obligatorio.' };
  }

  return {
    ok: true as const,
    data: {
      nombre,
      rut: d.rut || null,
      telefono: d.telefono?.trim() || null,
      email: d.email?.trim() || null,
      observaciones: d.observaciones?.trim() || null,
    },
  };
}

export async function getClientes() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    return await prisma.clientes.findMany({
      where: filtroClientes(ctx),
      select: {
        id: true,
        nombre: true,
        rut: true,
        telefono: true,
        email: true,
        activo: true,
        created_at: true,
        // Solo el conteo: el listado no necesita los inmuebles completos
        _count: { select: { inmuebles: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    return [];
  }
}

export async function getClientePorId(id: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return null;

    // El filtro de pertenencia va dentro de la consulta: los datos ajenos nunca salen de la BD
    return await prisma.clientes.findFirst({
      where: { id, ...filtroClientes(ctx) },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        nombre: true,
        rut: true,
        telefono: true,
        email: true,
        observaciones: true,
        created_at: true,
        inmuebles: {
          select: {
            id: true,
            direccion: true,
            comuna: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener el cliente por ID:', error);
    return null;
  }
}

// La página de edición importa este nombre
export async function obtenerClientePorId(id: string) {
  return getClientePorId(id);
}

// Para el selector del formulario de inmuebles
export async function getClientesSelect() {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return [];

    return await prisma.clientes.findMany({
      where: { activo: true, ...filtroClientes(ctx) },
      select: { id: true, nombre: true, email: true },
      orderBy: { nombre: 'asc' },
    });
  } catch (error) {
    console.error('Error al obtener clientes para el selector:', error);
    return [];
  }
}

export async function crearCliente(data: Record<string, any>) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const parsed = parsearCliente(data);
    if (!parsed.ok) return { success: false, error: parsed.error };

    await prisma.clientes.create({
      data: {
        ...parsed.data,
        // La pertenencia la define el servidor, nunca el formulario
        empresa_id: ctx.empresaId,
        tecnico_id: ctx.esIndependiente ? ctx.perfilId : null,
      },
    });

    revalidatePath('/dashboard/clientes');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error al crear el cliente:', error);
    return { success: false, error: error.message || 'No se pudo registrar el cliente.' };
  }
}

export async function actualizarCliente(id: string, data: Record<string, any>) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const parsed = parsearCliente(data);
    if (!parsed.ok) return { success: false, error: parsed.error };

    // updateMany con filtro de pertenencia: solo actualiza si el cliente es tuyo
    const { count } = await prisma.clientes.updateMany({
      where: { id, ...filtroClientes(ctx) },
      data: { ...parsed.data, updated_at: new Date() },
    });

    if (count === 0) {
      return { success: false, error: 'Cliente no encontrado o sin permisos.' };
    }

    revalidatePath('/dashboard/clientes');
    revalidatePath(`/dashboard/clientes/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error al actualizar el cliente:', error);
    return { success: false, error: error.message || 'No se pudo actualizar el cliente.' };
  }
}

export async function eliminarCliente(id: string) {
  try {
    const ctx = await obtenerContextoUsuarioActual();
    if (!ctx) return { success: false, error: 'No hay una sesión activa.' };

    const { count } = await prisma.clientes.deleteMany({
      where: { id, ...filtroClientes(ctx) },
    });

    if (count === 0) {
      return { success: false, error: 'Cliente no encontrado o sin permisos.' };
    }

    revalidatePath('/dashboard/clientes');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    // P2003: restricción de llave foránea (el cliente aún tiene inmuebles)
    if (error?.code === 'P2003') {
      return {
        success: false,
        error: 'No se puede eliminar: el cliente tiene inmuebles asociados. Elimínalos primero.',
      };
    }
    console.error('Error al eliminar el cliente:', error);
    return { success: false, error: error.message || 'No se pudo eliminar el cliente.' };
  }
}