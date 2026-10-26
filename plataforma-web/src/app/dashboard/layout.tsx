import { Suspense, ReactNode } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from '@/components/dashboard/Sidebar';

async function AuthGuard({
  children,
}: {
  children: ReactNode;
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

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Menú de navegación lateral fijo */}
      <DashboardSidebar />

      {/* Contenido principal de cada módulo */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<p>Verificando sesión...</p>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}