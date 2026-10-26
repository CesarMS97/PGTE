import { prisma } from "@/lib/prisma";
import { actualizarCliente } from "@/services/clientes.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientForm from "./client-form";

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

  const cliente = clienteEncontrado;

  // Server Action que procesa la actualización
  async function handleUpdateAction(formData: FormData) {
    "use server";

    const datosAEnviar = {
      empresa_id: cliente.empresa_id,
      nombre: (formData.get("nombre") as string) || "",
      rut: (formData.get("rut") as string) || null,
      telefono: (formData.get("telefono") as string) || null,
      email: (formData.get("email") as string) || null,
      observaciones: (formData.get("observaciones") as string) || null,
    };

    return await actualizarCliente(id, datosAEnviar);
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

        {/* Formulario Interactivo del Cliente */}
        <ClientForm cliente={cliente} id={id} action={handleUpdateAction} />

      </div>
    </div>
  );
}