
import Link from "next/link";
import { Zap, Mail, ArrowUp } from "lucide-react";

const footerLinks = [
  {
    name: "Inicio",
    href: "#inicio",
  },
  {
    name: "Funcionalidades",
    href: "#funcionalidades",
  },
  {
    name: "Cómo funciona",
    href: "#como-funciona",
  },
];

const contacts = [
  {
    email: "cesar.moreno@duocuc.cl",
  },
  {
    email: "marc.tapia@duocuc.cl",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 lg:pt-16">

        {/* Contenido principal */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">

          {/* Identidad */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="PGTE - Página principal"
            >
              <Zap
                size={27}
                fill="currentColor"
                className="text-blue-500"
                aria-hidden="true"
              />

              <span className="text-2xl font-black tracking-tight text-blue-500">
                PGTE
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Plataforma de Gestión Técnica Eléctrica.
              Organiza tus viviendas, visitas técnicas
              y cotizaciones desde un solo lugar.
            </p>

            <div className="mt-5 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs font-medium text-slate-300">
                Proyecto Capstone · Ingeniería Informática
              </span>
            </div>
          </div>

          {/* Navegación */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-bold text-white">
              Explorar
            </h3>

            <nav
              aria-label="Navegación del pie de página"
              className="flex flex-col items-start gap-4"
            >
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors hover:text-blue-400"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 text-sm font-bold text-white">
              Contacto
            </h3>

            <p className="mb-4 text-sm leading-6 text-slate-400">
              ¿Tienes consultas o sugerencias sobre PGTE?
            </p>

            <div className="flex flex-col items-start gap-4">
              {contacts.map((contact) => (
                <a
                  key={contact.email}
                  href={`mailto:${contact.email}`}
                  className="inline-flex max-w-full items-start gap-3 break-all text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  <span>{contact.email}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
        {/* Fin del grid principal */}

        {/* Separador inferior */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Copyright */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                © 2026 PGTE. Todos los derechos reservados.
              </p>

              <p className="text-xs text-slate-500">
                Aviso de privacidad en preparación.
              </p>
            </div>

            {/* Volver arriba */}
            <a
              href="#inicio"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-white/10 px-4 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500/40 hover:text-blue-400"
            >
              Volver arriba

              <ArrowUp
                size={16}
                aria-hidden="true"
              />
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
}
