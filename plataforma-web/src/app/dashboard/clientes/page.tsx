import { prisma } from "@/lib/prisma";
import { obtenerClientes } from "@/services/clientes.service";
import ClientesHeader from "@/components/clientes/ClientesHeader";
import ClientesTable from "@/components/clientes/ClientesTable";
import ClientesEmptyState from "@/components/clientes/ClientesEmptyState";

export default async function ClientesPage() {
  const empresa = await prisma.empresas.findFirst();

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Sin empresa registrada</h1>
        <p className="text-gray-600 mt-2">
          Registra una empresa en la base de datos para comenzar a gestionar clientes.
        </p>
      </div>
    );
  }

  const clientes = await obtenerClientes(empresa.id);

  return (
    <div className="space-y-8">
      <ClientesHeader empresaNombre={empresa.nombre} empresaId={empresa.id} />

      {clientes.length === 0 ? (
        <ClientesEmptyState />
      ) : (
        <ClientesTable clientes={clientes} />
      )}
    </div>
  );
}