
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ejecutar la autenticación durante la solicitud
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<p>Verificando sesión...</p>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
