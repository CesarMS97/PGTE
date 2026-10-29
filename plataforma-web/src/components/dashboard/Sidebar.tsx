import Link from 'next/link';

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen p-4 shadow-sm">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-primary">Plataforma PGTE</h1>
        <p className="text-xs text-muted-foreground">Panel de Control</p>
      </div>

      <nav className="space-y-1.5 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          📊 Inicio / Resumen
        </Link>
        <Link
          href="/dashboard/clientes"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          👥 Clientes
        </Link>
        <Link
          href="/dashboard/inmuebles"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          🏠 Inmuebles
        </Link>
        <Link
          href="/dashboard/cotizaciones"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          📄 Cotizaciones
        </Link>
        <Link
          href="/dashboard/levantamientos"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          🛠️ Levantamientos
        </Link>
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <div className="px-2">
          <p className="text-xs font-medium text-gray-800">Administrador</p>
          <p className="text-xs text-muted-foreground">Sesión Activa</p>
        </div>
      </div>
    </aside>
  );
}