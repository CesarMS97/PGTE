
const problems = [
  {
    icon: "📄",
    title: "Información técnica dispersa",
    description: "Datos en distintos formatos y lugares.",
  },
  {
    icon: "📋",
    title: "Registros manuales",
    description: "Difíciles de mantener y propensos a errores.",
  },
  {
    icon: "🧮",
    title: "Cotizaciones desorganizadas",
    description: "Sin un formato estándar y con poca trazabilidad.",
  },
  {
    icon: "🏠",
    title: "Sin historial centralizado",
    description: "Cada vivienda se gestiona de forma aislada.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Introducción */}
          <div className="space-y-4 lg:col-span-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-blue-600">
              El problema
            </span>

            <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
              Hoy la gestión eléctrica enfrenta varios desafíos
            </h2>

            <p className="text-sm leading-relaxed text-slate-600">
              PGTE nace para simplificar y centralizar todo el
              proceso de forma digital, segura y eficiente.
            </p>
          </div>

          {/* Problemas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-4">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  <span aria-hidden="true">{problem.icon}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {problem.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-500">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
