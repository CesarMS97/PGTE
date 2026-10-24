import { prisma } from "@/lib/prisma";
import { obtenerClientes } from "@/services/clientes.service";
import Link from "next/link";
import ClientModalButton from "@/components/clientes/ClientModalButton"; // O tu componente de modal interactivo

export default async function ClientesPage() {
  // 1. Buscamos la empresa activa de forma temporal para el MVP (luego vendrá del login)
  const empresa = await prisma.empresas.findFirst();

  if (!empresa) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Sin empresa registrada</h1>
        <p className="text-gray-600 mt-2">Registra una empresa en la base de datos para comenzar a gestionar clientes.</p>
      </div>
    );
  }

  // 2. Obtenemos los clientes estrictamente de esta empresa
  const clientes = await obtenerClientes(empresa.id);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Módulo de Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Empresa activa: <span className="font-semibold text-gray-700">{empresa.nombre}</span>
          </p>
        </div>

        {/* Botón para abrir el modal de Nuevo Cliente */}
        <ClientModalButton empresaId={empresa.id} />
      </div>

      {/* Listado de Clientes en Tabla */}
      {clientes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza registrando un nuevo cliente en el botón superior.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre / Razón Social</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{cliente.nombre}</div>
                    <div className="text-xs text-gray-400">Creado el {new Date(cliente.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cliente.rut || <span className="italic text-gray-400">Sin RUT</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{cliente.telefono || "Sin teléfono"}</div>
                    <div className="text-xs text-gray-400">{cliente.email || "Sin correo"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Enlace hacia la ruta [id] que definimos en la arquitectura */}
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
      )}
    </div>
  );
}