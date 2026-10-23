
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[620px] scroll-mt-20 items-center overflow-hidden bg-slate-950 text-white"
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-[position:center_40%]"
        style={{
          backgroundImage: "url('/images/home.jpg')",
        }}
      />

      {/* Degradado */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/25" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
        {/* Contenido principal */}
        <div className="space-y-7 lg:col-span-7">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
            Tecnología para el trabajo eléctrico
          </span>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[54px]">
            Gestiona tus servicios eléctricos
            <span className="block text-blue-400">
              en una sola plataforma
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Centraliza tus registros técnicos, administra viviendas
            y organiza cotizaciones desde una plataforma diseñada
            para profesionales del sector eléctrico.
          </p>

          <div className="flex flex-wrap gap-4 pt-3">
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Conocer la plataforma
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#funcionalidades"
              className="inline-flex items-center rounded-lg border border-slate-500/50 bg-slate-900/50 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-slate-800"
            >
              Ver funcionalidades
            </a>
          </div>
        </div>

        {/* Tarjeta informativa */}
        <div className="hidden justify-end lg:col-span-5 lg:flex">
          <div className="w-64 rounded-xl border border-white/15 bg-slate-950/55 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <span className="text-xl">✓</span>
            </div>

            <h3 className="mb-3 text-lg font-semibold">
              Gestión más eficiente
            </h3>

            <div className="space-y-2 text-sm text-slate-300">
              <p>Registros centralizados</p>
              <p>Información organizada</p>
              <p className="font-medium text-blue-400">
                Mejores decisiones técnicas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
