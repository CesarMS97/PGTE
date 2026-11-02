
import {
  Files,
  ClipboardList,
  Calculator,
  House,
  CheckCircle2,
} from "lucide-react";

const problems = [
  {
    icon: Files,
    title: "Información dispersa",
    description:
      "Datos de clientes, notas y antecedentes guardados en distintos lugares.",
    solution:
      "Organiza toda la información en una ficha por vivienda.",
  },
  {
    icon: ClipboardList,
    title: "Registros manuales",
    description:
      "Anotaciones en papel difíciles de consultar cuando vuelves a un trabajo.",
    solution:
      "Registra digitalmente tus visitas y observaciones técnicas.",
  },
  {
    icon: Calculator,
    title: "Cotizaciones desorganizadas",
    description:
      "Materiales, mano de obra y presupuestos gestionados por separado.",
    solution:
      "Mantén tus cotizaciones vinculadas a cada trabajo.",
  },
  {
    icon: House,
    title: "Sin historial técnico",
    description:
      "Dificultad para recuperar la información de instalaciones anteriores.",
    solution:
      "Consulta los antecedentes y visitas de cada vivienda.",
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problema"
      className="scroll-mt-20 bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Encabezado */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            El problema
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            ¿Te cuesta mantener organizados
            tus trabajos eléctricos?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Entre visitas, anotaciones y cotizaciones,
            la información puede terminar repartida
            en distintos lugares. PGTE te ayuda a
            mantenerla organizada.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <article
                key={problem.title}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                {/* Icono */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {/* Problema */}
                <h3 className="text-lg font-bold text-slate-900">
                  {problem.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {problem.description}
                </p>

                {/* Solución */}
                <div className="mt-auto pt-6">
                  <div className="mb-4 h-px bg-slate-100" />

                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-blue-600"
                      aria-hidden="true"
                    />

                    <p className="text-sm font-medium leading-6 text-slate-800">
                      {problem.solution}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mensaje final */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm font-medium text-slate-600 sm:text-base">
          Menos tiempo buscando información.
          <span className="text-blue-600">
            {" "}Más tiempo dedicado a tus trabajos.
          </span>
        </p>
      </div>
    </section>
  );
}
