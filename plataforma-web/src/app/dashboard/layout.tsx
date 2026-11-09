
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

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Recuperar nombre desde Supabase Auth
  const metadata = user.user_metadata ?? {};

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
    user.email?.split("@")[0] ||
    "Técnico";

  return (
    <DashboardShell
      nombre={nombreTecnico}
      email={user.email ?? ""}
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
