import { Suspense } from "react";
import { connection } from "next/server";
import { obtenerClientes } from "@/services/clientes.service";
import { obtenerContextoUsuarioActual } from "@/services/auth.service";
import ClientesHeader from "@/components/clientes/ClientesHeader";
import ClientesTable from "@/components/clientes/ClientesTable";
import ClientesEmptyState from "@/components/clientes/ClientesEmptyState";
import { StatsCard } from "@/components/ui/StatsCard";

async function ClientesContent() {
  await connection();

  // 1. Obtenemos el contexto completo del usuario actual
  const contexto = await obtenerContextoUsuarioActual();

  if (!contexto) {
    return (
      <div className="text-center py-12 px-4">
        <h1 className="text-2xl font-bold text-red-600">
          No autorizado
        </h1>
        <p className="text-gray-600 mt-2">
          No se encontró una sesión activa o un perfil válido en la base de datos.
        </p>
      </div>
    );
  }

  // 2. Consultamos los clientes dependiendo de si es empresa o independiente
  const clientes = await obtenerClientes(
    contexto.empresaId ?? undefined,
    contexto.esIndependiente ? contexto.perfilId : undefined
  );

  // Nombre para mostrar en el header o saludo
  const nombreEntidad = contexto.empresa?.nombre || "Técnico Independiente";
  const idEntidad = contexto.empresaId || contexto.perfilId;

  return (
    // Contenedor principal con padding lateral y ancho máximo para separarlo de las orillas
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <ClientesHeader
        empresaNombre={nombreEntidad}
        empresaId={idEntidad}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-slate-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 rounded-xl bg-slate-200" />
        <div className="h-24 rounded-xl bg-slate-200" />
      </div>

      <div className="h-64 rounded-xl bg-slate-200" />
    </div>
  );
}