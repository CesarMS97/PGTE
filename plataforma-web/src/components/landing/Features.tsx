
const features = [
  {
    icon: "🏠",
    title: "Gestión de viviendas",
    description: "Ficha digital, historial y antecedentes técnicos.",
  },
  {
    icon: "⚡",
    title: "Levantamiento técnico",
    description: "Registro de condiciones, observaciones y evidencias.",
  },
  {
    icon: "📄",
    title: "Cotizaciones",
    description: "Organiza soluciones, costos y estados de avance.",
  },
  {
    icon: "🧠",
    title: "Asistencia mediante IA",
    description:
      "Comparación entre estado actual y recomendaciones técnicas.",
  },
];

export default function Features() {
  return (
    <section
      id="funcionalidades"
      className="scroll-mt-20 bg-white px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-blue-600">
              Funcionalidades
            </span>

            <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
              Todo lo que necesitas en un solo lugar
            </h2>

            <p className="text-sm leading-relaxed text-slate-600">
              PGTE integra las herramientas esenciales para que
              técnicos eléctricos y empresas puedan trabajar con
              mayor control y productividad.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:bg-slate-100/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  <span aria-hidden="true">{feature.icon}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
