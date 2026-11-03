
import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-[#dce9f8]">

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(229,239,252,0.98) 0%, rgba(229,239,252,0.93) 40%, rgba(229,239,252,0.1) 100%), url('/images/dashboard-electricista.jpg')",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-2xl px-6 py-12 md:px-10 md:py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-800">
          Plataforma PGTE
        </p>

        <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
          Gestiona tus proyectos eléctricos
          de forma simple y eficiente
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 md:text-base">
          Centraliza la información de tus clientes,
          inmuebles, levantamientos técnicos y
          cotizaciones en una sola plataforma.
        </p>

        <Link
          href="/dashboard/levantamientos"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva visita técnica
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
