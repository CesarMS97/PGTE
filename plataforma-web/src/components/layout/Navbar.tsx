import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* LOGO PGTE */}
        <a
          href="#inicio"
          className="flex items-center gap-4"
          aria-label="Volver al inicio de PGTE"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-7 w-7 fill-blue-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>

            <span className="text-2xl font-black tracking-tighter text-blue-600">
              PGTE
            </span>
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          <span className="hidden text-xs font-medium leading-tight text-slate-500 sm:block">
            Plataforma de Gestión
            <br />
            Técnica Eléctrica
          </span>
        </a>

        {/* NAVEGACIÓN */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
        >
          <a
            href="#inicio"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            Inicio
          </a>

          <a
            href="#funcionalidades"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            Funcionalidades
          </a>

          <a
            href="#como-funciona"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            Cómo funciona
          </a>
        </nav>

        {/* BOTÓN INICIAR SESIÓN */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 sm:px-5"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>

          Iniciar sesión
        </Link>

      </div>
    </header>
  );
}
