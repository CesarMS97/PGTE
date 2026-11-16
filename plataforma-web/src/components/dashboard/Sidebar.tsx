"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  House,
  ClipboardList,
  FileText,
  FolderKanban,
  Zap,
  X,
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

const navigation = [
  {
    name: "Inicio / Resumen",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clientes",
    href: "/dashboard/clientes",
    icon: Users,
  },
  {
    name: "Inmuebles",
    href: "/dashboard/inmuebles",
    icon: House,
  },
  {
    name: "Proyectos",
    href: "/dashboard/proyectos",
    icon: FolderKanban,
  },
  {
    name: "Levantamientos",
    href: "/dashboard/levantamientos",
    icon: ClipboardList,
  },
  {
    name: "Cotizaciones",
    href: "/dashboard/cotizaciones",
    icon: FileText,
  },
];

type SidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
};

export function DashboardSidebar({
  mobile = false,
  onNavigate,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full min-h-[calc(100dvh-4rem)] flex-col bg-[#0D2345] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap
              size={24}
              className="fill-yellow-400 text-yellow-400"
            />
            <span className="text-xl font-bold">
              PGTE
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-300">
            Panel del técnico
          </p>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav
        aria-label="Navegación principal"
        className="flex-1 space-y-1 px-3 py-6"
      >
        {navigation.map(({ name, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" &&
              pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={19}
                className={
                  active ? "text-yellow-300" : ""
                }
              />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Pie del sidebar */}
      <div className="border-t border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/30">
            <Zap
              size={18}
              className="text-yellow-400"
            />
          </div>

          <div>
            <p className="text-xs font-semibold">
              PGTE
            </p>
            <p className="text-xs text-slate-400">
              Gestión Técnica Eléctrica
            </p>
          </div>
        </div>

        {/* Cerrar sesión en móvil */}
        {mobile && (
          <div className="mt-5 border-t border-white/10 pt-4">
            <LogoutButton />
          </div>
        )}
      </div>
    </aside>
  );
}