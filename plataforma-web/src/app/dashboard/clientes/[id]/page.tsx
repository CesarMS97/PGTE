import { obtenerClientePorId } from "@/services/clientes.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteClienteButton } from "@/components/clientes/DeleteClienteButton";

interface ClienteDetallePageProps {
  params: Promise<{ id: string }>;
}

export default async function ClienteDetallePage({ params }: ClienteDetallePageProps) {
  const { id } = await params;

  // Obtenemos los datos del cliente incluyendo sus viviendas/inmuebles relacionados
  const cliente = await obtenerClientePorId(id);

  if (!cliente) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Botón de retorno */}
      <div className="mb-6">
        <Link 
          href="/dashboard/clientes" 
          className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 w-fit"
        >
          ← Volver al listado de clientes
        </Link>
      </div>

      {/* Cabecera del Cliente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">Ficha de Cliente</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{cliente.nombre}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registrado el {new Date(cliente.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Acciones de gestión del cliente */}
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/clientes/${cliente.id}/editar`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Editar datos
          </Link>
          
          {/* Botón de eliminación integrado de forma segura */}
          <DeleteClienteButton id={cliente.id} />
        </div>
      </div>

      {/* Grid de Información de Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <span className="text-xs font-semibold text-gray-400 uppercase">RUT</span>
          <p className="text-base font-medium text-gray-800 mt-1">{cliente.rut || "Sin RUT registrado"}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <span className="text-xs font-semibold text-gray-400 uppercase">Teléfono de contacto</span>
          <p className="text-base font-medium text-gray-800 mt-1">{cliente.telefono || "Sin teléfono"}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <span className="text-xs font-semibold text-gray-400 uppercase">Correo electrónico</span>
          <p className="text-base font-medium text-gray-800 mt-1">{cliente.email || "Sin correo electrónico"}</p>
        </div>
      </div>

      {cliente.observaciones && (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8">
          <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">Observaciones</span>
          <p className="text-sm text-gray-700 leading-relaxed">{cliente.observaciones}</p>
        </div>
      )}

      {/* Sección de Viviendas / Inmuebles asociados */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Viviendas Asociadas</h2>
            <p className="text-xs text-gray-500 mt-0.5">Inmuebles registrados bajo la tutela de este cliente.</p>
          </div>
          
          {/* Botón funcional para registrar un nuevo inmueble */}
          <Link 
            href="/dashboard/inmuebles/nuevo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5"
          >
            + Nuevo inmueble
          </Link>
        </div>

        {(!cliente.inmuebles || cliente.inmuebles.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Este cliente no tiene viviendas asociadas todavía.</p>
            <p className="text-xs text-gray-400">Comienza registrando la primera propiedad desde el botón superior.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cliente.inmuebles.map((inmueble) => (
              <div key={inmueble.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{inmueble.direccion}</p>
                  <p className="text-xs text-gray-500">Comuna: {inmueble.comuna || "No especificada"}</p>
                </div>
                
                {/* Enlace al detalle del inmueble */}
                <Link
                  href={`/dashboard/inmuebles/${inmueble.id}`}
                  className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Ver inmueble
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}