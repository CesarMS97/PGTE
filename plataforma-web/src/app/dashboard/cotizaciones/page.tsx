import { Suspense } from 'react';
import { connection } from 'next/server';
import { Loader2 } from 'lucide-react';
import {
  getCotizaciones,
  getProyectosParaCotizar,
} from '@/services/cotizaciones.service';
import { CotizacionesView } from '@/components/cotizaciones/CotizacionesView';

async function CotizacionesContent() {
  await connection();

  // Ambas consultas en paralelo, directamente en el servidor
  const [cotizaciones, levantamientos] = await Promise.all([
    getCotizaciones(),
    getProyectosParaCotizar(),
  ]);

  return (
    <CotizacionesView
      cotizaciones={cotizaciones}
      levantamientos={levantamientos}
    />
  );
}

function CotizacionesLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-12 flex justify-center items-center text-slate-400 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          Cargando cotizaciones...
        </div>
      </div>
    </div>
  );
}

export default function CotizacionesPage() {
  return (
    <Suspense fallback={<CotizacionesLoading />}>
      <CotizacionesContent />
    </Suspense>
  );
}