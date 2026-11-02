
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[580px] scroll-mt-20 items-center overflow-hidden bg-slate-950 text-white sm:min-h-[620px] lg:min-h-[680px]"
    >
      {/* Imagen de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:65%_center] sm:bg-center lg:bg-[position:center_40%]"
        style={{
          backgroundImage: "url('/images/home.jpg')",
        }}
      />

      {/* Overlay adaptable a cada dispositivo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/80 sm:bg-gradient-to-r sm:from-slate-950 sm:via-slate-950/90 sm:to-slate-950/45"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:px-8 lg:py-28">

        {/* Contenido principal */}
        <div className="min-w-0 space-y-6 sm:space-y-7 lg:col-span-7">

          <span className="block text-xs font-bold uppercase tracking-[0.16em] text-blue-400 sm:tracking-[0.2em]">
            Tu trabajo eléctrico, más organizado
          </span>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[56px]">
            Menos papeleo.
            <span className="mt-2 block text-blue-400">
              Más tiempo para tus trabajos eléctricos.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            Registra tus visitas, organiza la información de
            cada vivienda y prepara cotizaciones desde una
            sola plataforma, estés en terreno o en casa.
          </p>

          {/* Botones */}
          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4">

            <a
              href="#como-funciona"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:w-auto sm:text-base"
            >
              Descubre cómo funciona
              <span aria-hidden="true">→</span>
            </a>

            <Link
              href="/login"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-slate-400/60 bg-slate-900/50 px-6 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:w-auto sm:text-base"
            >
              Ingresar a PGTE
            </Link>
          </div>

          {/* Beneficios rápidos */}
          <div className="flex flex-wrap gap-x-5 gap-y-3 pt-5 text-sm text-slate-300">
            {[
              "Registros centralizados",
              "Historial por vivienda",
              "Cotizaciones organizadas",
            ].map((beneficio) => (
              <div
                key={beneficio}
                className="flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
                <span>{beneficio}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta informativa: solo escritorio */}
        <div className="hidden justify-end lg:col-span-5 lg:flex">
          <div className="w-72 rounded-2xl border border-white/15 bg-slate-950/65 p-7 shadow-2xl backdrop-blur-md">

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>

            <h2 className="mb-3 text-lg font-bold">
              Todo en un solo lugar
            </h2>

            <p className="mb-5 text-sm leading-6 text-slate-300">
              Organiza la información de tus trabajos sin
              depender de múltiples archivos o registros.
            </p>

            <div className="space-y-3 text-sm">
              <p className="text-slate-200">
                ✓ Fichas de viviendas
              </p>
              <p className="text-slate-200">
                ✓ Visitas técnicas
              </p>
              <p className="font-semibold text-blue-400">
                ✓ Cotizaciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
