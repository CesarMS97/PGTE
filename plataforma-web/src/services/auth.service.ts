import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function obtenerEmpresaDelUsuarioActual() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // 1. Intentamos buscar tu perfil vinculado
    const perfil = await prisma.perfiles.findUnique({
      where: { id: user.id },
      include: {
        empresas: true,
      },
    });

    if (perfil?.empresas) {
      return perfil.empresas;
    }

    // 2. RESPALDO TEMPORAL: Si aún no tienes perfil creado en la BD,
    // devolvemos la primera empresa para que no se bloquee tu pantalla.
    const empresaDefault = await prisma.empresas.findFirst();
    return empresaDefault || null;

  } catch (error) {
    console.error("Error al obtener la empresa del usuario:", error);
    // Fallback de emergencia
    return await prisma.empresas.findFirst();
  }
}