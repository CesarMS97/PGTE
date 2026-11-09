
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

const problems = [
  {
    number: "01",
    title: "Información dispersa",
    description:
      "Datos de clientes, notas y antecedentes guardados en distintos lugares.",
    solution:
      "Centraliza toda la información en una ficha por vivienda.",
    image: "/images/problems/informacion-dispersa.webp",
    alt: "Documentos y registros técnicos dispersos",
  },
  {
    number: "02",
    title: "Registros manuales",
    description:
      "Anotaciones en papel difíciles de consultar cuando retomas un trabajo.",
    solution:
      "Registra digitalmente tus levantamientos y observaciones técnicas.",
    image: "/images/problems/registros-manuales.webp",
    alt: "Formulario de registro técnico en papel",
  },
  {
    number: "03",
    title: "Cotizaciones desorganizadas",
    description:
      "Materiales, mano de obra y presupuestos gestionados por separado.",
    solution:
      "Mantén tus cotizaciones vinculadas a cada trabajo.",
    image: "/images/problems/cotizaciones.webp",
    alt: "Calculadora, presupuestos y materiales eléctricos",
  },
  {
    number: "04",
    title: "Sin historial técnico",
    description:
      "Dificultad para recuperar información de instalaciones anteriores.",
    solution:
      "Consulta los antecedentes y levantamientos de cada vivienda.",
    image: "/images/problems/historial-tecnico.webp",
    alt: "Plano de vivienda con documentación técnica",
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
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            El problema
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            ¿Te cuesta mantener organizados tus trabajos eléctricos?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Entre levantamientos, anotaciones y cotizaciones,
            la información puede terminar repartida en distintos
            lugares. PGTE te ayuda a mantenerla organizada.
          </p>
        </div>

        {/* Indicador de carrusel móvil */}
        <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
          <p className="text-xs font-medium text-slate-500">
            Explora los problemas
          </p>

          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
            Desliza
            <ArrowRight size={15} />
          </div>
        </div>

        {/* Carrusel móvil / Grid escritorio */}
        <div
          aria-label="Problemas que resuelve PGTE"
          className="
            flex w-full snap-x snap-mandatory gap-4
            overflow-x-auto overscroll-x-contain
            pb-5
            md:grid md:grid-cols-2 md:gap-6 md:overflow-visible
            xl:grid-cols-4
          "
        >
          {problems.map((problem) => (
            <article
              key={problem.number}
              className="
                group flex w-[85%] min-w-[85%]
                max-w-[340px] shrink-0 snap-start
                flex-col overflow-hidden rounded-2xl
                border border-slate-200 bg-white
                shadow-sm transition-all duration-300
                hover:border-blue-200 hover:shadow-lg
                md:w-auto md:min-w-0 md:max-w-none
                xl:hover:-translate-y-1
                motion-reduce:transform-none
              "
            >
              {/* Imagen */}
              <div className="relative aspect-[16/10] overflow-hidden bg-blue-50">
                <Image
                  src={problem.image}
                  alt={problem.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) 85vw, (max-width: 1279px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                />



                {/* Número de tarjeta */}
                <span className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                  {problem.number}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">

                {/* Título */}
                <h3 className="text-lg font-bold leading-snug text-slate-900">
                  {problem.title}
                </h3>

                {/* Descripción */}
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {problem.description}
                </p>

                {/* Solución PGTE */}
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
              </div>
            </article>
          ))}
        </div>

        {/* Mensaje final */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm font-medium text-slate-600 sm:mt-12 sm:text-base">
          Menos tiempo buscando información.
          <span className="text-blue-600">
            {" "}Más tiempo dedicado a tus trabajos.
          </span>
        </p>
      </div>
    </section>
  );
}
