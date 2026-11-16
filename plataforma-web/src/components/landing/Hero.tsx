
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="
        relative isolate flex min-h-[580px]
        scroll-mt-20 items-center overflow-hidden
        bg-[#06162E] text-white
        sm:min-h-[620px] lg:min-h-[680px]
      "
    >
      {/* Imagen optimizada del Hero */}
      <Image
        src="/images/home.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        aria-hidden="true"
        className="
          -z-20 object-cover
          object-[68%_center]
          sm:object-[60%_center]
          lg:object-[center_40%]
        "
      />

      {/* Degradado principal PGTE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,12,30,0.94) 0%, rgba(3,12,30,0.88) 30%, rgba(3,12,30,0.62) 55%, rgba(3,12,30,0.18) 100%)",
        }}
      />

      {/* Contraste adicional en celulares */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-slate-950/20 sm:bg-transparent"
      />

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:px-8 lg:py-28">

        {/* Texto principal */}
        <div className="min-w-0 space-y-6 sm:space-y-7 lg:col-span-7">

          {/* Etiqueta */}
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
            Tu trabajo eléctrico, más organizado
          </span>

          {/* Título */}
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[56px]">
            Menos papeleo.
            <span className="mt-2 block text-blue-400">
              Más tiempo para tus trabajos eléctricos.
            </span>
          </h1>

          {/* Descripción */}
          <p className="max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            Registra tus levantamientos técnicos, organiza
            la información de cada vivienda y prepara
            cotizaciones desde una sola plataforma,
            estés en terreno o en casa.
          </p>

          {/* Botones */}
          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4">

            <a
              href="#como-funciona"
              className="
                inline-flex min-h-12 w-full items-center
                justify-center gap-3 rounded-lg
                bg-blue-600 px-6 py-3.5
                text-center text-sm font-semibold
                text-white transition-colors
                hover:bg-blue-500
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blue-400
                sm:w-auto sm:text-base
              "
            >
              Descubre cómo funciona
              <ArrowRight size={18} aria-hidden="true" />
            </a>

            <Link
              href="/login"
              className="
                inline-flex min-h-12 w-full items-center
                justify-center rounded-lg
                border border-white/30 bg-slate-950/35
                px-6 py-3.5 text-center
                text-sm font-semibold text-white
                backdrop-blur-sm transition-colors
                hover:bg-white/10
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blue-400
                sm:w-auto sm:text-base
              "
            >
              Ingresar a PGTE
            </Link>
          </div>

          {/* Beneficios rápidos */}
          <div className="flex flex-wrap gap-x-5 gap-y-3 pt-5 text-sm text-slate-200">
            {[
              "Registros centralizados",
              "Historial por vivienda",
              "Cotizaciones organizadas",
            ].map((beneficio) => (
              <div
                key={beneficio}
                className="flex items-center gap-2"
              >
                <Check
                  size={16}
                  strokeWidth={2.5}
                  className="shrink-0 text-blue-400"
                  aria-hidden="true"
                />
                <span>{beneficio}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta informativa - Solo escritorio */}
        <div className="hidden justify-end lg:col-span-5 lg:flex">
          <div
            className="
              w-72 rounded-2xl border border-white/20
              bg-[#06162E]/65 p-7
              shadow-2xl backdrop-blur-md
            "
          >
            {/* Icono */}
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <ClipboardCheck size={24} aria-hidden="true" />
            </div>

            {/* Título */}
            <h2 className="mb-3 text-lg font-bold">
              Todo en un solo lugar
            </h2>

            {/* Descripción */}
            <p className="mb-5 text-sm leading-6 text-slate-200">
              Organiza la información de tus trabajos
              sin depender de múltiples archivos o registros.
            </p>

            {/* Funcionalidades */}
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-200">
                <Check size={16} className="text-blue-400" />
                Fichas de viviendas
              </p>

              <p className="flex items-center gap-2 text-slate-200">
                <Check size={16} className="text-blue-400" />
                Levantamientos técnicos
              </p>

              <p className="flex items-center gap-2 font-semibold text-blue-400">
                <Check size={16} />
                Cotizaciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
