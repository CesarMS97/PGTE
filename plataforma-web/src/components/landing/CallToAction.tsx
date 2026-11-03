
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

const benefits = [
  "Toda tu información organizada",
  "Acceso desde celular o computador",
  "Pensado para técnicos eléctricos independientes",
];

export default function CallToAction() {
  return (
    <section
      id="comenzar"
      className="relative isolate overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-24"
    >
      {/* Efectos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Mensaje principal */}
          <div className="lg:col-span-7">

            <div className="mb-5 flex items-center gap-2">
              <Zap
                size={17}
                className="text-blue-400"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                Tu trabajo, más simple
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
              Organiza tus próximos
              <span className="block text-blue-400">
                trabajos eléctricos con PGTE.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Deja atrás las anotaciones dispersas.
              Mantén tus viviendas, visitas técnicas
              y cotizaciones organizadas en un solo lugar.
            </p>

            {/* Botón principal */}
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:w-auto sm:text-base"
              >
                Ingresar a PGTE

                <ArrowRight
                  size={19}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Accede con tu cuenta de PGTE.
            </p>
          </div>

          {/* Beneficios */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">

              <h3 className="mb-6 text-lg font-bold text-white">
                Todo lo esencial para tu trabajo
              </h3>

              <div className="space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />

                    <span className="text-sm leading-6 text-slate-200 sm:text-base">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-sm leading-6 text-slate-400">
                  Una plataforma diseñada para simplificar
                  la gestión diaria de tus servicios eléctricos.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
