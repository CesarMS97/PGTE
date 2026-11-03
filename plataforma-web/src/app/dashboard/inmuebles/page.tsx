import { Suspense } from "react";
import { connection } from "next/server";
import { getInmuebles } from "@/services/inmuebles.service";
import { InmueblesHeader } from "@/components/inmuebles/InmueblesHeader";
import { InmueblesEmptyState } from "@/components/inmuebles/InmueblesEmptyState";
import { InmueblesTable } from "@/components/inmuebles/InmueblesTable";
import { StatsCard } from "@/components/ui/StatsCard";

// Componente que obtiene los datos desde Prisma
async function InmueblesContent() {
  await connection();

  const inmuebles = await getInmuebles();

  return (
    // Contenedor con ancho máximo y márgenes laterales idénticos al módulo de clientes
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <InmueblesHeader />

      {/* Tarjetas de resumen */}
      {inmuebles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            label="Total Inmuebles"
            value={inmuebles.length}
            gradient="blue"
          />

          <StatsCard
            label="Clientes"
            value={
              new Set(
                inmuebles
                  .map((i: any) => i.clientes?.nombre)
                  .filter(Boolean)
              ).size
            }
            gradient="slate"
          />
        </div>
      )}

      {inmuebles.length === 0 ? (
        <InmueblesEmptyState />
      ) : (
        <InmueblesTable inmuebles={inmuebles} />
      )}
    </div>
  );
}

// Página principal con Suspense
export default function InmueblesPage() {
  return (
    <Suspense fallback={<InmueblesLoading />}>
      <InmueblesContent />
    </Suspense>
  );
}

// Interfaz de carga temporal con los mismos márgenes estéticos
function InmueblesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-200" />
        </div>

        <div className="h-10 w-40 rounded-lg bg-slate-200" />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 rounded-xl bg-slate-200" />
        <div className="h-24 rounded-xl bg-slate-200" />
      </div>

      {/* Tabla */}
      <div className="h-64 rounded-xl bg-slate-200" />
    </div>
  );
}