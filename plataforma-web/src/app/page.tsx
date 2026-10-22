import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      
      {/* 1. NAVEGACIÓN (HEADER) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Subtítulo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-black text-2xl tracking-tighter flex items-center gap-1">
                <svg className="w-7 h-7 fill-blue-600" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                PGTE
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs text-slate-500 font-medium hidden sm:block leading-tight">
              Plataforma de Gestión<br />Técnica Eléctrica
            </span>
          </div>

          {/* Menú Central */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#inicio" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Inicio</a>
            <a href="#funcionalidades" className="hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Cómo funciona</a>
          </nav>

          {/* Botón Acceso */}
          <div>
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

  
      {/* 2. HERO SECTION */}
      <section
        id="inicio"
        className="relative min-h-[620px] flex items-center overflow-hidden bg-slate-950 text-white"
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[position:center_40%]"
          style={{
            backgroundImage: "url('/images/home.jpg')",
          }}
        />

        {/* Degradado para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/25" />

        {/* Contenido */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">

          {/* Columna izquierda */}
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

          {/* Columna derecha */}
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


      {/* 3. EL PROBLEMA */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4 space-y-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">El problema</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Hoy la gestión eléctrica enfrenta varios desafíos
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                PGTE nace para simplificar y centralizar todo el proceso de forma digital, segura y eficiente.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              
              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">📄</div>
                <h3 className="font-bold text-slate-900 text-sm">Información técnica dispersa</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Datos en distintos formatos y lugares.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">📋</div>
                <h3 className="font-bold text-slate-900 text-sm">Registros manuales</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Difíciles de mantener y propensos a errores.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">🧮</div>
                <h3 className="font-bold text-slate-900 text-sm">Cotizaciones desorganizadas</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Sin un formato estándar y con poca trazabilidad.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">🏠</div>
                <h3 className="font-bold text-slate-900 text-sm">Sin historial centralizado</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Cada vivienda se gestiona de forma aislada.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4 space-y-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Funcionalidades</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Todo lo que necesitas en un solo lugar
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                PGTE integra las herramientas esenciales para que los técnicos eléctricos y empresas puedan trabajar con mayor control y productividad.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 hover:bg-slate-100/80 transition-colors">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">🏠</div>
                <h3 className="font-bold text-slate-900 text-sm">Gestión de viviendas</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Ficha digital, historial y antecedentes técnicos.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 hover:bg-slate-100/80 transition-colors">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">⚡</div>
                <h3 className="font-bold text-slate-900 text-sm">Levantamiento técnico</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Registro de condiciones, observaciones y evidencias.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 hover:bg-slate-100/80 transition-colors">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">📄</div>
                <h3 className="font-bold text-slate-900 text-sm">Cotizaciones</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Organiza soluciones, costos y estados de avance.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 hover:bg-slate-100/80 transition-colors">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">🧠</div>
                <h3 className="font-bold text-slate-900 text-sm">Asistencia mediante IA</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Comparación entre estado actual y recomendaciones técnicas.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-4 space-y-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Cómo funciona</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Un proceso simple y eficiente
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                PGTE te guía paso a paso para que puedas centrarte en lo importante: el trabajo en terreno.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Paso 1 */}
              <div className="space-y-4 relative">
                <div className="w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">1</div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="text-2xl mb-2">🏠</div>
                  <h3 className="font-bold text-slate-900 text-sm">Registrar la vivienda</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Ingresa los antecedentes y datos del cliente.</p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="space-y-4 relative">
                <div className="w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">2</div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-bold text-slate-900 text-sm">Realizar el levantamiento</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Completa la inspección técnica y registra hallazgos.</p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="space-y-4 relative">
                <div className="w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">3</div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-bold text-slate-900 text-sm">Evaluar y proponer</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Analiza las condiciones y define las posibles soluciones.</p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="space-y-4 relative">
                <div className="w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">4</div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="text-2xl mb-2">📄</div>
                  <h3 className="font-bold text-slate-900 text-sm">Generar la cotización</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Crea, revisa y gestiona la cotización con tu cliente.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. BANNER INFERIOR (CALL TO ACTION) */}
      <section className="bg-slate-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest block">
              Tu trabajo, más simple
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Centraliza tus registros técnicos y organiza la gestión de tus servicios eléctricos con PGTE.
            </h2>
            <div className="pt-2">
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
              >
                Ingresar a la plataforma
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3 border-l border-slate-800 pl-0 lg:pl-8">
            <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              Seguro y confiable
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
              Accesible desde cualquier dispositivo
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Hecho para técnicos eléctricos
            </div>
          </div>

        </div>
      </section>

      {/* 7. PIE DE PÁGINA (FOOTER) */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-6 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="text-blue-500 font-black text-lg tracking-tight">PGTE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Plataforma de Gestión Técnica Eléctrica</span>
          </div>

          <div className="text-center md:text-left text-slate-500 space-y-1">
            <p><strong className="text-slate-400">Proyecto Capstone</strong> - Ingeniería Informática</p>
            <p>Contacto: <a href="mailto:cesar.moreno@duoc.cl" className="text-blue-400 hover:underline">cesar.moreno@duoc.cl</a></p>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Aviso de privacidad</a>
            <span>© 2025 PGTE. Todos los derechos reservados.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}