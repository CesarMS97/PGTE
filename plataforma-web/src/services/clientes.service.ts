'use server';

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/schemas/cliente.schema";
import { obtenerEmpresaDelUsuarioActual } from "@/services/auth.service";

// Obtiene todos los clientes registrados de la empresa actual con sus inmuebles asociados.
export async function obtenerClientes(empresaId: string) {
  try {
    const clientes = await prisma.clientes.findMany({
      where: { empresa_id: empresaId },
      include: {
        inmuebles: true,
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
    // 1. Obtenemos dinámicamente la empresa del usuario autenticado actual
    const empresa = await obtenerEmpresaDelUsuarioActual();
    if (!empresa) {
      return { success: false, error: "No se encontró una empresa asociada al usuario actual." };
    }

    // 2. Normalizamos campos vacíos o undefined a null para que Zod no falle
    const rawData = data as Record<string, any>;
    const datosNormalizados = {
      ...rawData,
      rut: rawData.rut?.trim() || null,
      telefono: rawData.telefono?.trim() || null,
      email: rawData.email?.trim() || null,
      observaciones: rawData.observaciones?.trim() || null,
    };

    // 3. Valida la entrada usando el schema de Zod
    const validacion = clienteSchema.safeParse(datosNormalizados);
    if (!validacion.success) {
      const mensajeError = validacion.error.issues[0]?.message || "Datos inválidos.";
      return { success: false, error: mensajeError };
    }

    const datosValidados = validacion.data;
    const rutNormalizado = normalizarRut(datosValidados.rut);

    // 4. Control de duplicados estrictamente dentro de la empresa del usuario
    if (rutNormalizado) {
      const clienteExistente = await prisma.clientes.findFirst({
        where: { 
          rut: rutNormalizado,
          empresa_id: empresa.id, 
        },
      });

      if (clienteExistente) {
        return { 
          success: false, 
          error: `Ya existe un cliente registrado con el RUT ${datosValidados.rut}: ${clienteExistente.nombre} en tu empresa.` 
        };
      }
    }

    // 5. Crear el cliente asignando obligatoriamente el ID de la empresa logueada
    const nuevoCliente = await prisma.clientes.create({
      data: {
        empresa_id: empresa.id,
        nombre: datosValidados.nombre.trim(),
        rut: rutNormalizado, 
        telefono: datosValidados.telefono?.trim() || null,
        email: datosValidados.email?.trim() || null,
        observaciones: datosValidados.observaciones?.trim() || null,
      },
    }); 
    
    revalidatePath("/clientes");
    revalidatePath("/dashboard/clientes");
    revalidatePath("/dashboard/inmuebles/nueva");

    return { success: true, data: nuevoCliente, mensaje: "Cliente creado exitosamente." };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    console.error("Error al crear cliente:", error);
    return { success: false, error: "No se pudo registrar el cliente en la base de datos." };
  }
}

export async function actualizarCliente(id: string, data: unknown) {
  try {
    const empresa = await obtenerEmpresaDelUsuarioActual();
    if (!empresa) {
      return { success: false, error: "No se encontró una empresa asociada al usuario actual." };
    }

    const clienteExistente = await prisma.clientes.findFirst({
      where: { id, empresa_id: empresa.id },
    });
    if (!clienteExistente) {
      return { success: false, error: "Cliente no encontrado o no pertenece a tu empresa." };
    }

    const rawData = data as Record<string, any>;
    const datosNormalizados = {
      ...rawData,
      rut: rawData.rut?.trim() || null,
      telefono: rawData.telefono?.trim() || null,
      email: rawData.email?.trim() || null,
      observaciones: rawData.observaciones?.trim() || null,
    };

    const validacion = clienteSchema.safeParse(datosNormalizados);
    if (!validacion.success) {
      const mensajeError = validacion.error.issues[0]?.message || "Datos inválidos.";
      return { success: false, error: mensajeError };
    }

    const datosValidados = validacion.data;
    const rutNormalizado = normalizarRut(datosValidados.rut);

    if (rutNormalizado) {
      const duplicado = await prisma.clientes.findFirst({
        where: { 
          rut: rutNormalizado, 
          empresa_id: empresa.id,
          NOT: { id } 
        },
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
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    console.error("Error al actualizar cliente:", error);
    return { success: false, error: "No se pudo actualizar el cliente." };
  }
}

export async function eliminarCliente(id: string) {
  try {
    const empresa = await obtenerEmpresaDelUsuarioActual();
    if (!empresa) {
      return { success: false, error: "No se encontró una empresa asociada al usuario actual." };
    }

    const clienteExistente = await prisma.clientes.findFirst({
      where: { id, empresa_id: empresa.id },
    });
    if (!clienteExistente) {
      return { success: false, error: "Cliente no encontrado o no pertenece a tu empresa." };
    }

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

    // Rutas correctas del dashboard
    revalidatePath("/dashboard/clientes");
    revalidatePath("/dashboard/inmuebles/nueva");
    
    return { success: true, mensaje: "Cliente eliminado exitosamente." };
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    console.error("Error al eliminar cliente:", error);
    return { success: false, error: "No se pudo eliminar el cliente." };
  }
}

export async function obtenerClientePorId(id: string) {
  try {
    const empresa = await obtenerEmpresaDelUsuarioActual();
    if (!empresa) return null;

    return await prisma.clientes.findFirst({
      where: { id, empresa_id: empresa.id },
      include: { inmuebles: { orderBy: { created_at: "desc" } } },
    });
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return null;
  }
}