import Link from "next/link";

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen space-y-6">
      {/* Barra de Navegación Superior / Breadcrumbs */}
      <nav className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <Link 
            href="/dashboard" 
            className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1.5"
          >
            Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <Link 
            href="/dashboard/clientes" 
            className="text-blue-600 font-semibold hover:underline"
          >
            Clientes
          </Link>
        </div>

        {/* Acceso rápido global del módulo */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <span className="hidden sm:inline bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            Módulo Activo
          </span>
        </div>
      </nav>

      {/* Contenido dinámico de las páginas hijas (listado, detalle, editar) */}
      <main>{children}</main>
    </div>
  );
}