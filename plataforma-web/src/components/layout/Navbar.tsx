
"use client";

import { useState } from "react";
import Link from "next/link";

const navigation = [
  { name: "Inicio", href: "#inicio" },
  { name: "Qué ofrece PGTE", href: "#funcionalidades" },
  { name: "Cómo funciona", href: "#como-funciona" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">

        {/* Logo */}
        <a
          href="#inicio"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-3"
          aria-label="Ir al inicio de PGTE"
        >
          <div className="flex shrink-0 items-center gap-2">
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

          <div className="hidden h-7 w-px bg-slate-200 sm:block" />

          <span className="hidden text-xs font-medium leading-tight text-slate-500 sm:block">
            Plataforma de Gestión
            <br />
            Técnica Eléctrica
          </span>
        </a>

        {/* Navegación escritorio */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex shrink-0 items-center gap-3">

          <Link
            href="/login"
            className="hidden min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:inline-flex"
          >
            Iniciar sesión
          </Link>

          {/* Botón menú móvil y tablet */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú desplegable */}
      <nav
        id="mobile-navigation"
        aria-label="Navegación móvil"
        className={`border-t border-slate-100 bg-white lg:hidden ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">

          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="flex min-h-12 items-center rounded-lg px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}

          <Link
            href="/login"
            onClick={closeMenu}
            className="mt-3 flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 sm:hidden"
          >
            Iniciar sesión
          </Link>
        </div>
      </nav>
    </header>
  );
}
