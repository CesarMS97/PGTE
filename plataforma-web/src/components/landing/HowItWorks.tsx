
import {
  House,
  ClipboardList,
  Wrench,
  FileText,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: House,
    title: "Registra la vivienda",
    description:
      "Crea una ficha con los datos del cliente y los antecedentes de la vivienda.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Realiza el levantamiento",
    description:
      "Registra la información del tablero, los circuitos y las observaciones técnicas.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Define el trabajo",
    description:
      "Identifica las soluciones necesarias y organiza los materiales y trabajos a realizar.",
  },
  {
    number: "04",
    icon: FileText,
    title: "Prepara la cotización",
    description:
      "Registra materiales, mano de obra y costos para elaborar el presupuesto.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Encabezado */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Cómo funciona
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            De la visita técnica
            <span className="block text-blue-600">
              a la cotización
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Cuatro pasos para mantener organizado tu
            trabajo, desde el primer contacto hasta
            la preparación del presupuesto.
          </p>
        </div>

        {/* Flujo de trabajo */}
        <div className="relative">

          {/* Línea conectora para escritorio */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-6 hidden border-t-2 border-dashed border-blue-200 lg:block"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="relative flex flex-col"
                >
                  {/* Número del paso */}
                  <div className="relative z-10 mb-5 flex items-center justify-start lg:justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md ring-4 ring-slate-50">
                      {step.number}
                    </div>
                  </div>

                  {/* Tarjeta */}
                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">

                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon
                        size={25}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>

                    {/* Indicador de continuación */}
                    {index < steps.length - 1 && (
                      <div className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-blue-600 lg:hidden">
                        <span>Siguiente paso</span>
                        <ArrowRight
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Mensaje final */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-slate-600 sm:text-base">
            Un proceso claro para cada trabajo.
            <span className="font-semibold text-blue-600">
              {" "}Toda la información en PGTE.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
