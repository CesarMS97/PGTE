import { Suspense } from "react";
import { connection } from "next/server";
import { obtenerClientes } from "@/services/clientes.service";
import { obtenerEmpresaDelUsuarioActual } from "@/services/auth.service"; // <--- Importamos la función que creamos

import ClientesHeader from "@/components/clientes/ClientesHeader";
import ClientesTable from "@/components/clientes/ClientesTable";
import ClientesEmptyState from "@/components/clientes/ClientesEmptyState";
import { StatsCard } from "@/components/ui/StatsCard";

async function ClientesContent() {
  await connection();

  // 1. Obtenemos la empresa del técnico logueado mediante su perfil
  const empresa = await obtenerEmpresaDelUsuarioActual();

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">
          Sin empresa asignada
        </h1>
        <p className="text-gray-600 mt-2">
          Tu usuario actual no tiene un perfil vinculado a ninguna empresa en la base de datos.
        </p>
      </div>
    );
  }

  // 2. Consultamos SOLO los clientes de TU empresa
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
                (c: any) =>
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