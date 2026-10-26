
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { obtenerClientes } from "@/services/clientes.service";

import ClientesHeader from "@/components/clientes/ClientesHeader";
import ClientesTable from "@/components/clientes/ClientesTable";
import ClientesEmptyState from "@/components/clientes/ClientesEmptyState";
import { StatsCard } from "@/components/ui/StatsCard";

// Componente que realiza las consultas a la base de datos
async function ClientesContent() {
  const empresa = await prisma.empresas.findFirst();

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">
          Sin empresa registrada
        </h1>
        <p className="text-gray-600 mt-2">
          Registra una empresa en la base de datos para
          comenzar a gestionar clientes.
        </p>
      </div>
    );
  }

  const clientes = await obtenerClientes(empresa.id);

  return (
    <div className="space-y-8">
      <ClientesHeader
        empresaNombre={empresa.nombre}
        empresaId={empresa.id}
      />

      {/* Tarjetas de resumen */}
      {clientes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            label="Clientes"
            value={clientes.length}
            gradient="blue"
          />

          <StatsCard
            label="Total Inmuebles"
            value={
              clientes.filter(
                (c) =>
                  c.inmuebles &&
                  c.inmuebles.length > 0
              ).length
            }
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

// Página principal con Suspense
export default function ClientesPage() {
  return (
    <Suspense fallback={<ClientesLoading />}>
      <ClientesContent />
    </Suspense>
  );
}

// Componente mostrado mientras se cargan los datos
function ClientesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-slate-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 rounded-xl bg-slate-200" />
        <div className="h-24 rounded-xl bg-slate-200" />
      </div>

      <div className="h-64 rounded-xl bg-slate-200" />
    </div>
  );
}
