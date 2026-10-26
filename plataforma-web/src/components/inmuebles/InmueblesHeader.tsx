import Link from 'next/link';

export function InmueblesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Inmuebles
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestión e inventario de propiedades asignadas a los clientes.
        </p>
      </div>
      <Link
        href="/dashboard/inmuebles/nueva"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
      >
        + Registrar Inmueble
      </Link>
    </div>
  );
}