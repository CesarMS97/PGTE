
import {
  House,
  ClipboardCheck,
  FileText,
  History,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: House,
    title: "Gestión de viviendas",
    description:
      "Organiza los datos de tus clientes y los antecedentes de cada vivienda en una ficha digital.",
    details: [
      "Datos generales de la vivienda",
      "Información del cliente",
      "Antecedentes técnicos",
    ],
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Levantamiento técnico",
    description:
      "Registra las condiciones de la instalación eléctrica durante tus visitas a terreno.",
    details: [
      "Información del tablero",
      "Registro de circuitos",
      "Observaciones técnicas",
    ],
  },
  {
    number: "03",
    icon: FileText,
    title: "Cotizaciones",
    description:
      "Organiza los materiales, la mano de obra y los costos asociados a cada trabajo.",
    details: [
      "Materiales y cantidades",
      "Costos de mano de obra",
      "Total de la cotización",
    ],
  },
];

export default function Features() {
  return (
    <section
      id="funcionalidades"
      className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Encabezado */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            PGTE en acción
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Desde la primera visita
            <span className="block text-blue-600">
              hasta la cotización
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Conoce las herramientas que te permiten
            organizar tus trabajos eléctricos desde
            una sola plataforma.
          </p>
        </div>

        {/* Funcionalidades principales */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg sm:p-8"
              >
                {/* Número e icono */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="text-3xl font-bold text-slate-200">
                    {feature.number}
                  </span>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                {/* Detalles */}
                <div className="mt-6 space-y-3">
                  {feature.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                        aria-hidden="true"
                      />

                      <span className="text-sm text-slate-700">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pie de tarjeta */}
                <div className="mt-auto pt-7">
                  <div className="h-px bg-slate-200" />

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <span>Herramienta PGTE</span>
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Historial técnico */}
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:flex-row sm:items-center sm:p-8">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <History size={25} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              Historial técnico por vivienda
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Consulta los antecedentes y registros de
              visitas anteriores para mantener la
              continuidad de tus trabajos.
            </p>
          </div>

          <div className="hidden shrink-0 text-blue-600 sm:block">
            <ArrowRight size={25} />
          </div>
        </div>
      </div>
    </section>
  );
}
