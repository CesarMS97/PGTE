
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardHeader from "./DashboardHeader";
import { DashboardSidebar } from "./Sidebar";

type DashboardShellProps = {
  children: ReactNode;
  nombre: string;
  email: string;
};

export default function DashboardShell({
  children,
  nombre,
  email,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar menú al cambiar de sección
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <DashboardHeader
        nombre={nombre}
        email={email}
        onMenuClick={() => setMenuOpen(true)}
      />

      <div className="flex min-h-[calc(100dvh-4rem)]">
        {/* Sidebar de escritorio */}
        <div className="hidden w-64 shrink-0 lg:block">
          <DashboardSidebar />
        </div>

        {/* Overlay móvil */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          />
        )}

        {/* Sidebar móvil */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 lg:hidden ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <DashboardSidebar
            mobile
            onNavigate={() => setMenuOpen(false)}
            onClose={() => setMenuOpen(false)}
          />
        </div>

        {/* Contenido */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
