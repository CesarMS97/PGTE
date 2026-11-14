import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const instant = false;

async function AuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  await connection();

  const supabase = await createClient();

  // getClaims() valida el JWT localmente (sin viaje de red a Supabase Auth)
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    redirect("/login");
  }

  // Recuperar nombre desde los claims del token
  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const email = typeof claims.email === "string" ? claims.email : "";

  const nombreCompleto = [
    metadata.nombre,
    metadata.apellido,
  ]
    .filter(
      (valor): valor is string =>
        typeof valor === "string" &&
        valor.trim().length > 0
    )
    .join(" ")
    .trim();

  const nombreTecnico =
    nombreCompleto ||
    email.split("@")[0] ||
    "Técnico";

  return (
    <DashboardShell
      nombre={nombreTecnico}
      email={email}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">
            Verificando sesión...
          </p>
        </div>
      }
    >
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}