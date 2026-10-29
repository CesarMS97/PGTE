import Link from "next/link";

interface Cliente {
  id: string;
  nombre: string;
  rut: string | null;
  telefono: string | null;
  email: string | null;
  created_at: Date;
}

export default function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre / Razón Social
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RUT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{cliente.nombre}</div>
                <div className="text-xs text-gray-400">
                  Creado el {new Date(cliente.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {cliente.rut || <span className="italic text-gray-400">Sin RUT</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{cliente.telefono || "Sin teléfono"}</div>
                <div className="text-xs text-gray-400">{cliente.email || "Sin correo"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/dashboard/clientes/${cliente.id}`}
                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}