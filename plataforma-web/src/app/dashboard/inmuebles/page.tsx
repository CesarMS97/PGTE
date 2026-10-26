import { getInmuebles } from '@/services/inmuebles.service';
import { InmueblesHeader } from "@/components/inmuebles/InmueblesHeader";
import { InmueblesEmptyState } from '@/components/inmuebles/InmueblesEmptyState';
import { InmueblesTable } from '@/components/inmuebles/InmueblesTable';
import { StatsCard } from '@/components/ui/StatsCard';

export default async function InmueblesPage() {
  const inmuebles = await getInmuebles();

  return (
    <div className="space-y-6">
      <InmueblesHeader />

      {/* Tarjetas de resumen métrico (2 columnas) */}
      {inmuebles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard 
            label="Total Inmuebles" 
            value={inmuebles.length} 
            gradient="blue" 
          />
          <StatsCard 
            label="Clientes" 
            value={new Set(inmuebles.map(i => i.clientes?.nombre).filter(Boolean)).size} 
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