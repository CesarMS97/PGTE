import Link from 'next/link';

interface InmuebleConCliente {
  id: string;
  direccion: string;
  comuna: string;
  tipo_uso: string | null;
  clientes?: {
    nombre: string;
  } | null;
}

export function InmueblesTable({ inmuebles }: { inmuebles: InmuebleConCliente[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Dirección</th>
              <th className="py-3.5 px-6">Comuna</th>
              <th className="py-3.5 px-6">Tipo de Uso</th>
              <th className="py-3.5 px-6">Cliente / Propietario</th>
              <th className="py-3.5 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {inmuebles.map((inmueble) => (
              <tr key={inmueble.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{inmueble.direccion}</td>
                <td className="py-4 px-6 text-slate-600">{inmueble.comuna}</td>
                <td className="py-4 px-6">
                  {inmueble.tipo_uso ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {inmueble.tipo_uso}
                    </span>
                  ) : (
                    <span className="text-slate-400">N/D</span>
                  )}
                </td>
                <td className="py-4 px-6 text-slate-600">
                  {inmueble.clientes ? (
                    inmueble.clientes.nombre
                  ) : (
                    <span className="text-slate-400 italic">Sin asignar</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <Link
                    href={`/dashboard/inmuebles/${inmueble.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/dashboard/inmuebles/${inmueble.id}/editar`}
                    className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}