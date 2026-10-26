import Link from 'next/link';
import { ClienteForm } from '@/components/clientes/ClientForm';

export default async function EditarClientePage({ params }: { params: { id: string } }) {
  // Aquí puedes buscar el cliente real por ID en tu base de datos si lo requieres, ej:
  // const cliente = await getClienteById(params.id);

  const clienteEjemplo = {
    nombre: "Constructora del norte",
    rut: "78699566-K",
    telefono: "+56985697542",
    email: "constructoradelnorte@gmail.com",
    observaciones: "instalación de cableado en oficinas nuevas."
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

      <ClienteForm initialData={clienteEjemplo} isEditing={true} />
    </div>
  );
}