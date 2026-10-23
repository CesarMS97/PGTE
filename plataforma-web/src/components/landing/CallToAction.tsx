
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-6 py-16 text-white">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Mensaje */}
        <div className="space-y-6 lg:col-span-7">
          <span className="block text-xs font-bold uppercase tracking-widest text-blue-400">
            Tu trabajo, más simple
          </span>

          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Centraliza tus registros técnicos y organiza la
            gestión de tus servicios eléctricos con PGTE.
          </h2>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Ingresar a la plataforma
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Beneficios */}
        <div className="space-y-4 border-slate-800 pl-0 lg:col-span-5 lg:border-l lg:pl-8">
          {[
            "Gestión centralizada de información",
            "Accesible desde distintos dispositivos",
            "Diseñado para técnicos eléctricos",
          ].map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 text-sm font-medium text-slate-300"
            >
              <svg
                className="h-5 w-5 shrink-0 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
