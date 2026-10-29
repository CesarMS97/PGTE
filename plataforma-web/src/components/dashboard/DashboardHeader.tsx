
import { Bell, ChevronDown, Zap } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

type DashboardHeaderProps = {
  email?: string;
};

export default function DashboardHeader({
  email,
}: DashboardHeaderProps) {
  const nombre = email?.split("@")[0] ?? "Usuario";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-900">
          <Zap className="h-7 w-7 fill-blue-600 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">
            PGTE
          </span>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        <span className="hidden text-xs text-slate-500 sm:block">
          Plataforma de Gestión Técnica Eléctrica
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-slate-500 sm:block">
          <Bell className="h-5 w-5" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {nombre.slice(0, 2).toUpperCase()}
          </div>

          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-slate-800">
              {nombre}
            </span>
            <span className="text-xs text-slate-500">
              Usuario PGTE
            </span>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
