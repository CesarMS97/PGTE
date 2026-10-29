'use server';

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clienteSchema, ClienteInput } from "@/schemas/cliente.schema";

// Obtiene todos los clientes registrados ordenados por fecha de creación.
// Obtiene todos los clientes registrados ordenados por fecha de creación con sus inmuebles asociados.
export async function obtenerClientes(empresaId: string) {
  try {
    const clientes = await prisma.clientes.findMany({
      where: { empresa_id: empresaId },
      include: {
        inmuebles: true, // <--- ¡Añade esto aquí!
      },
      orderBy: { created_at: 'desc' },
    });
    return clientes;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }
}

/**
 * Obtiene una lista reducida de clientes (id, nombre, email) para usar en componentes <select>
 */
export async function getClientesSelect(empresaId?: string) {
  try {
    const clientes = await prisma.clientes.findMany({
      where: empresaId ? { empresa_id: empresaId } : undefined,
      select: {
        id: true,
        nombre: true,
        email: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    return clientes;
  } catch (error) {
    console.error("Error al obtener clientes para select:", error);
    return [];
  }
}

function normalizarRut(rut?: string | null): string | null {
  if (!rut) return null;
  
  let limpio = rut.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
  if (limpio === "") return null;

  if (!limpio.includes("-") && limpio.length > 1) {
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    limpio = `${cuerpo}-${dv}`;
  }

  return limpio;
}

export async function crearCliente(data: unknown) {
  try {
    // Valida la entrada usando el schema de Zod
    const validacion = clienteSchema.safeParse(data);
    if (!validacion.success) {
      const mensajeError = validacion.error.issues[0]?.message || "Datos inválidos.";
      return { success: false, error: mensajeError };
    }

    const datosValidados = validacion.data;
    const rutNormalizado = normalizarRut(datosValidados.rut);

    // Control de duplicados por RUT y Empresa
    if (rutNormalizado) {
      const clienteExistente = await prisma.clientes.findFirst({
        where: { 
          rut: rutNormalizado,
          empresa_id: datosValidados.empresa_id 
        },
      });

      if (clienteExistente) {
        return { 
          success: false, 
          error: `Ya existe un cliente registrado con el RUT ${datosValidados.rut}: ${clienteExistente.nombre}.` 
        };
      }
    }

    const nuevoCliente = await prisma.clientes.create({
      data: {
        empresa_id: datosValidados.empresa_id,
        nombre: datosValidados.nombre.trim(),
        rut: rutNormalizado, 
        telefono: datosValidados.telefono?.trim() || null,
        email: datosValidados.email?.trim() || null,
        observaciones: datosValidados.observaciones?.trim() || null,
      },
    }); 
    
    revalidatePath("/clientes");
    revalidatePath("/dashboard/inmuebles/nueva");

    return { success: true, data: nuevoCliente, mensaje: "Cliente creado exitosamente." };
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return { success: false, error: "No se pudo registrar el cliente en la base de datos." };
  }
}

export async function actualizarCliente(id: string, data: unknown) {
  try {
    // Valida la entrada usando el schema de Zod
    const validacion = clienteSchema.safeParse(data);
    if (!validacion.success) {
      const mensajeError = validacion.error.issues[0]?.message || "Datos inválidos.";
      return { success: false, error: mensajeError };
    }

    const datosValidados = validacion.data;
    const rutNormalizado = normalizarRut(datosValidados.rut);

    if (rutNormalizado) {
      const duplicado = await prisma.clientes.findFirst({
        where: { rut: rutNormalizado, NOT: { id } },
      });
      if (duplicado) {
        return {
          success: false,
          error: `Ya existe otro cliente con el RUT ${datosValidados.rut}: ${duplicado.nombre}.`,
        };
      }
    }

    const clienteActualizado = await prisma.clientes.update({
      where: { id },
      data: {
        nombre: datosValidados.nombre.trim(),
        rut: rutNormalizado,
        telefono: datosValidados.telefono?.trim() || null,
        email: datosValidados.email?.trim() || null,
        observaciones: datosValidados.observaciones?.trim() || null,
      },
    });

    revalidatePath(`/dashboard/clientes/${id}`);
    revalidatePath(`/dashboard/clientes/${id}/editar`);
    revalidatePath("/dashboard/clientes");
    revalidatePath("/dashboard/inmuebles/nueva");

    return { success: true, data: clienteActualizado, mensaje: "Cliente actualizado exitosamente." };
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return { success: false, error: "No se pudo actualizar el cliente." };
  }
}

export async function eliminarCliente(id: string) {
  try {
    const cantidadInmuebles = await prisma.inmuebles.count({
      where: { cliente_id: id },
    });

    if (cantidadInmuebles > 0) {
      return {
        success: false,
        error: `No se puede eliminar: el cliente tiene ${cantidadInmuebles} inmueble(s) asociado(s).`,
      };
    }

    await prisma.clientes.delete({ where: { id } });

    revalidatePath("/clientes");
    revalidatePath("/dashboard/inmuebles/nueva");
    return { success: true, mensaje: "Cliente eliminado exitosamente." };
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return { success: false, error: "No se pudo eliminar el cliente." };
  }
}

export async function obtenerClientePorId(id: string) {
  try {
    return await prisma.clientes.findUnique({
      where: { id },
      include: { inmuebles: { orderBy: { created_at: "desc" } } },
    });
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return null;
  }
}