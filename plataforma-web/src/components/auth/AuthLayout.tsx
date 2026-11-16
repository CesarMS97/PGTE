import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <section className="rounded-2xl border border-slate-200/80 bg-white px-6 py-8 shadow-2xl sm:px-9 sm:py-10">
          {/* Identidad de PGTE */}
          <header className="mb-8 text-center">
            <Link
              href="/"
              aria-label="Volver al inicio de PGTE"
              className="inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
            >
              <Zap size={28} fill="currentColor" aria-hidden="true" />
              <span className="text-3xl font-extrabold tracking-tight">
                PGTE
              </span>
            </Link>

            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Plataforma de Gestión Técnica Eléctrica
            </p>

            {/* Título de la página */}
            <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </header>

          {/* Formulario */}
          {children}
        </section>

        {/* Regresar a la landing */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}