import Link from 'next/link';

export default function NuevoClientePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Encabezado con navegación de retorno */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/dashboard/clientes" 
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Volver a Clientes
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Registrar Nuevo Cliente
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ingresa la información del cliente para vincularlo a la empresa.
          </p>
        </div>
      </div>

      {/* Tarjeta del formulario */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Nombre / Razón Social
            </label>
            <input 
              type="text" 
              placeholder="Ej. Juan Pérez o Constructora SpA"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              placeholder="cliente@ejemplo.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Teléfono
            </label>
            <input 
              type="tel" 
              placeholder="+56 9 1234 5678"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/dashboard/clientes"
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}