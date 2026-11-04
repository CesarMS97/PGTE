import Link from "next/link";
import {
  Users,
  House,
  ClipboardList,
  FileText,
  UserPlus,
  HousePlus,
  ClipboardPlus,
  ArrowRight,
  Clock3,
} from "lucide-react";

const stats = [
  { label: "Clientes", value: "12", icon: Users },
  { label: "Viviendas", value: "8", icon: House },
  { label: "Levantamientos pendientes", value: "3", icon: ClipboardList },
  { label: "Cotizaciones", value: "5", icon: FileText },
];

const actions = [
  { label: "Nuevo cliente", href: "/dashboard/clientes", icon: UserPlus },
  { label: "Nueva vivienda", href: "/dashboard/inmuebles", icon: HousePlus },
  { label: "Nuevo levantamiento", href: "/dashboard/levantamientos", icon: ClipboardPlus },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <header>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Mi panel de trabajo
          </h1>
          <p className="mt-2 text-slate-500">
            Gestiona tus clientes, viviendas y trabajos eléctricos.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <Icon className="h-5 w-5 text-blue-700" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Acciones rápidas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Comienza una nueva gestión.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {actions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
              >
                <Icon className="h-6 w-6 text-blue-700" />
                <span className="flex-1 text-sm font-medium text-slate-800">
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Visitas pendientes</h2>
            </div>
            <div className="mt-6 rounded-lg bg-slate-50 p-6 text-center">
              <Clock3 className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm text-slate-500">
                Aquí aparecerán tus próximas visitas técnicas.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-700" />
              <h2 className="text-lg font-semibold">Cotizaciones recientes</h2>
            </div>
            <div className="mt-6 rounded-lg bg-slate-50 p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm text-slate-500">
                Aquí aparecerán tus últimas cotizaciones.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}