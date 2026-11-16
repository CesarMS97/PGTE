'use server';

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// cache(): dentro de un mismo request, aunque lo llamen 5 componentes, se ejecuta una sola vez
export const obtenerContextoUsuarioActual = cache(async () => {
  try {
    const supabase = await createClient();

    // getClaims() valida el JWT localmente (sin viaje innecesario a Supabase Auth)
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;

    if (error || !claims?.sub) return null;

    const perfil = await prisma.perfiles.findUnique({
      where: { id: claims.sub },
      relationLoadStrategy: "join", // una sola consulta SQL optimizada
      select: {
        id: true,
        empresa_id: true,
        empresas: { select: { id: true, nombre: true, rut: true } },
      },
    });

    if (!perfil) return null;

    return {
      usuarioId: claims.sub,
      email: claims.email as string | undefined,
      perfilId: perfil.id,
      esIndependiente: !perfil.empresa_id,
      empresaId: perfil.empresa_id || null,
      empresa: perfil.empresas || null,
    };
  } catch (error) {
    console.error("Error al obtener el contexto del usuario:", error);
    return null;
  }
});

/**
 * Sincroniza o crea el perfil en la base de datos local (PostgreSQL) 
 * inmediatamente después de que un técnico se registra en Supabase Auth.
 */
export async function crearPerfilDespuesDeRegistro(data: { userId: string; nombre: string; email: string }) {
  try {
    // Usamos upsert para ser totalmente resilientes ante reintentos o registros previos
    await prisma.perfiles.upsert({
      where: { id: data.userId },
      update: {
        nombre: data.nombre,
        email: data.email,
      },
      create: {
        id: data.userId,
        nombre: data.nombre,
        apellido: '', // Requerido estrictamente por el esquema de perfiles
        email: data.email,  // Requerido estrictamente por el esquema de perfiles
        activo: true,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error al sincronizar el perfil local post-registro:", error);
    return { success: false, error: error.message };
  }
}