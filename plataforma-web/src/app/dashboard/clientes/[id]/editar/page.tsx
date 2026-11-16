import { obtenerClientePorId } from "@/services/clientes.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClienteForm } from "@/components/clientes/ClientForm";
import { connection } from "next/server";

// Configuración requerida en Next.js 16 para rutas dinámicas con llamadas a servidor
export const instant = false;

interface EditarClientePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: EditarClientePageProps) {
  await connection();
  const { id } = await params;

  // Obtenemos el cliente real desde la base de datos
  const clienteRaw = await obtenerClientePorId(id);

  if (!clienteRaw) {
    notFound();
  }

  // Preparamos los datos limpios para el formulario
  const clienteData = {
    nombre: clienteRaw.nombre,
    rut: clienteRaw.rut ?? undefined,
    telefono: clienteRaw.telefono ?? undefined,
    email: clienteRaw.email ?? undefined,
    observaciones: clienteRaw.observaciones ?? undefined,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link 
          href="/dashboard/clientes" 
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Volver a Clientes
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Editar datos del cliente
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Modifica la información de contacto y guárdalos en el sistema.
        </p>
      </div>

      {/* Pasamos los datos y el id por separado */}
      <ClienteForm 
        initialData={clienteData} 
        clienteId={clienteRaw.id} 
        isEditing={true} 
      />
    </div>
  );
}