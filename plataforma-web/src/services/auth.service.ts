import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function obtenerContextoUsuarioActual() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // 1. Buscamos el perfil del usuario actual en la base de datos
    const perfil = await prisma.perfiles.findUnique({
      where: { id: user.id },
      include: {
        empresas: true,
      },
    });

    if (!perfil) {
      return null;
    }

    // 2. Retornamos el contexto estructurado:
    // Si tiene empresa, actúa bajo empresa. Si no, es un técnico independiente.
    return {
      usuarioId: user.id,
      email: user.email,
      perfilId: perfil.id,
      esIndependiente: !perfil.empresa_id,
      empresaId: perfil.empresa_id || null,
      empresa: perfil.empresas || null,
    };

  } catch (error) {
    console.error("Error al obtener el contexto del usuario:", error);
    return null;
  }
}