
"use client";

import { Menu, Zap } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

type DashboardHeaderProps = {
  nombre: string;
  email: string;
  onMenuClick: () => void;
};

export default function DashboardHeader({
  nombre,
  email,
  onMenuClick,
}: DashboardHeaderProps) {
  const nombreSeguro = nombre?.trim() || "Técnico";

  const iniciales = nombreSeguro
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div className="flex items-center gap-2">
          <Zap className="h-7 w-7 fill-blue-600 text-blue-600" />
          <span className="text-xl font-bold text-[#0D2345]">
            PGTE
          </span>
        </div>

        <span className="ml-3 hidden border-l border-slate-200 pl-4 text-xs text-slate-500 xl:block">
          Plataforma de Gestión Técnica Eléctrica
        </span>
      </div>

      {/* Perfil */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <div
          className="flex items-center gap-2.5"
          title={email}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0D2345] text-xs font-bold text-white">
            {iniciales}
          </div>

          <div className="hidden min-w-0 flex-col sm:flex">
            <span className="max-w-40 truncate text-sm font-semibold text-slate-900">
              {nombreSeguro}
            </span>
            <span className="text-xs text-slate-500">
              Técnico eléctrico
            </span>
          </div>
        </div>

        <div className="hidden sm:block">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
