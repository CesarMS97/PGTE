
const steps = [
  {
    number: "1",
    icon: "🏠",
    title: "Registrar la vivienda",
    description: "Ingresa los antecedentes y datos del cliente.",
  },
  {
    number: "2",
    icon: "📋",
    title: "Realizar el levantamiento",
    description:
      "Completa la inspección técnica y registra hallazgos.",
  },
  {
    number: "3",
    icon: "💡",
    title: "Evaluar y proponer",
    description:
      "Analiza las condiciones y define las posibles soluciones.",
  },
  {
    number: "4",
    icon: "📄",
    title: "Generar la cotización",
    description:
      "Crea, revisa y gestiona la cotización con tu cliente.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 bg-slate-50 px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Introducción */}
          <div className="space-y-4 lg:col-span-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-blue-600">
              Cómo funciona
            </span>

            <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
              Un proceso simple y eficiente
            </h2>

            <p className="text-sm leading-relaxed text-slate-600">
              PGTE te guía paso a paso para que puedas centrarte
              en lo importante: el trabajo en terreno.
            </p>
          </div>

          {/* Pasos */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="space-y-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md">
                  {step.number}
                </div>

                <div className="h-full min-h-44 space-y-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 text-2xl" aria-hidden="true">
                    {step.icon}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
