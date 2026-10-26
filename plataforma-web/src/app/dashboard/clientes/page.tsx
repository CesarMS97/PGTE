import { prisma } from "@/lib/prisma";
import { obtenerClientes } from "@/services/clientes.service";
import ClientesHeader from "@/components/clientes/ClientesHeader";
import ClientesTable from "@/components/clientes/ClientesTable";
import ClientesEmptyState from "@/components/clientes/ClientesEmptyState";
import { StatsCard } from "@/components/ui/StatsCard";

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

      {/* Tarjetas de resumen métrico (2 columnas) */}
      {clientes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard 
            label="Clientes" 
            value={clientes.length} 
            gradient="blue" 
          />
          <StatsCard 
            label="Total Inmuebles" 
            value={clientes.filter((c: any) => c.inmuebles && c.inmuebles.length > 0).length} 
            gradient="indigo" 
          />
        </div>
      )}

      {clientes.length === 0 ? (
        <ClientesEmptyState />
      ) : (
        <ClientesTable clientes={clientes} />
      )}
    </div>
  );
}