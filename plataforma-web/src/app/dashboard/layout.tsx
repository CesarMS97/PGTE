
import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">

      {/* Header superior */}
      <DashboardHeader email={user.email} />

      {/* Sidebar y contenido */}
      <div className="flex flex-1">

        <DashboardSidebar />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
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
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
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
