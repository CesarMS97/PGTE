import { prisma } from "@/lib/prisma";
import { actualizarCliente } from "@/services/clientes.service";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface EditarClientePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: EditarClientePageProps) {
  const { id } = await params;

  const clienteEncontrado = await prisma.clientes.findUnique({
    where: { id },
  });

  if (!clienteEncontrado) {
    notFound();
  }

  // Creamos una constante asegurada para usarla dentro de la Server Action
  const cliente = clienteEncontrado;

  async function handleUpdate(formData: FormData) {
    "use server";

    const datosAEnviar = {
      empresa_id: cliente.empresa_id, // ¡Ahora TypeScript ya no dirá que es null!
      nombre: formData.get("nombre"),
      rut: formData.get("rut"),
      telefono: formData.get("telefono"),
      email: formData.get("email"),
      observaciones: formData.get("observaciones"),
    };

    const resultado = await actualizarCliente(id, datosAEnviar);

    if (resultado.success) {
      redirect(`/dashboard/clientes/${id}`);
    } else {
      console.error(resultado.error);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Botón de retorno */}
      <div className="mb-6">
        <Link 
          href={`/dashboard/clientes/${id}`}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 w-fit"
        >
          ← Volver al detalle del cliente
        </Link>
      </div>

      {/* Tarjeta del Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Cabecera */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">Gestión de Clientes</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Editar datos del cliente</h1>
          <p className="text-sm text-gray-500 mt-0.5">Modifica la información de contacto y guárdalos en el sistema.</p>
        </div>

        {/* Formulario */}
        <form action={handleUpdate} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
              Nombre o Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={cliente.nombre}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">RUT</label>
              <input
                type="text"
                name="rut"
                defaultValue={cliente.rut || ""}
                placeholder="Ej. 12.345.678-9"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Teléfono</label>
              <input
                type="text"
                name="telefono"
                defaultValue={cliente.telefono || ""}
                placeholder="Ej. +56912345678"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              defaultValue={cliente.email || ""}
              placeholder="contacto@empresa.cl"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Observaciones</label>
            <textarea
              name="observaciones"
              rows={4}
              defaultValue={cliente.observaciones || ""}
              placeholder="Notas adicionales..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              href={`/dashboard/clientes/${id}`}
              className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              Guardar cambios
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}