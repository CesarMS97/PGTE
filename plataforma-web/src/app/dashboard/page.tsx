
import Link from "next/link";
import {
  Users,
  House,
  ClipboardList,
  FileText,
  ArrowUpRight,
} from "lucide-react";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";

const indicadores = [
  {
    titulo: "Clientes",
    descripcion: "Registrados en el sistema",
    icono: Users,
    href: "/dashboard/clientes",
    color: "bg-blue-100 text-blue-700",
  },
  {
    titulo: "Inmuebles",
    descripcion: "Propiedades registradas",
    icono: House,
    href: "/dashboard/viviendas",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    titulo: "Levantamientos",
    descripcion: "Visitas técnicas",
    icono: ClipboardList,
    href: "/dashboard/levantamientos",
    color: "bg-violet-100 text-violet-700",
  },
  {
    titulo: "Cotizaciones",
    descripcion: "Presupuestos eléctricos",
    icono: FileText,
    href: "/dashboard/cotizaciones",
    color: "bg-amber-100 text-amber-700",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">

      {/* Banner principal */}
      <WelcomeBanner />

      {/* Indicadores */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Resumen general
          </h2>
          <p className="text-sm text-slate-500">
            Accede rápidamente a los módulos de PGTE.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicadores.map((item) => {
            const Icono = item.icono;

            return (
              <Link
                key={item.titulo}
                href={item.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icono className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {item.titulo}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {item.descripcion}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sección inferior */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="text-lg font-bold text-slate-900">
            Últimas actividades
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Aquí se mostrarán los últimos registros
            y trabajos realizados en PGTE.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
            Historial de actividades próximamente
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">
            Gestión técnica centralizada
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Organiza tus visitas técnicas, registra
            observaciones de instalaciones eléctricas
            y administra las cotizaciones asociadas
            a cada inmueble.
          </p>

          <Link
            href="/dashboard/levantamientos"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Ir a levantamientos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
