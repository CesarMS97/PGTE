
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 px-6 py-10 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        {/* Identidad */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-black tracking-tight text-blue-500"
          >
            PGTE
          </Link>

          <span className="text-slate-600">|</span>

          <span className="text-slate-400">
            Plataforma de Gestión Técnica Eléctrica
          </span>
        </div>

        {/* Información */}
        <div className="space-y-1 text-center text-slate-500 md:text-left">
          <p>
            <strong className="text-slate-400">
              Proyecto Capstone
            </strong>
            {" "}– Ingeniería Informática
          </p>

          <p>
            Contacto:{" "}
            <a
              href="mailto:cesar.moreno@duocuc.cl"
              className="text-blue-400 hover:underline"
            >
              cesar.moreno@duocuc.cl
            </a>
          </p>
        </div>

        {/* Enlaces */}
        <div className="flex items-center gap-6 text-slate-500">
            <span>
                Aviso de privacidad próximamente
            </span>

            <span>
            © 2026 PGTE.
            </span>
        </div>
      </div>
    </footer>
  );
}
