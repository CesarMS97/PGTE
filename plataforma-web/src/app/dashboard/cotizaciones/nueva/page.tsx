import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { obtenerOCrearCotizacion } from '@/services/cotizaciones.service';
import { CotizacionFormView } from '@/components/cotizaciones/CotizacionFormView';

interface PageProps {
  searchParams: Promise<{ proyectoId?: string }>;
}

async function NuevaCotizacionContent({ searchParams }: PageProps) {
  await connection();

  const { proyectoId } = await searchParams;

  if (!proyectoId || proyectoId === 'undefined') {
    redirect('/dashboard/cotizaciones');
  }

  // Proyecto + cliente + cotización con ítems en una sola consulta
  const resultado = await obtenerOCrearCotizacion(proyectoId);

  if (!resultado) {
    redirect('/dashboard/cotizaciones');
  }

  const { cotizacion, proyectoTitulo, clienteNombre } = resultado;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                Folio: {cotizacion.numero}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 uppercase">
                Estado: {cotizacion.estado}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-2">Generar Presupuesto Comercial</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Proyecto: <span className="font-semibold text-slate-700">{proyectoTitulo}</span> — Cliente:{' '}
              <span className="font-semibold text-slate-700">{clienteNombre}</span>
            </p>
          </div>

          <a
            href="/dashboard/cotizaciones"
            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            ← Volver a Cotizaciones
          </a>
        </div>

        <CotizacionFormView proyectoId={cotizacion.proyecto_id} initialCotizacion={cotizacion} />
      </div>
    </div>
  );
}

export default function NuevaCotizacionPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Cargando cotización...
        </div>
      }
    >
      <NuevaCotizacionContent searchParams={searchParams} />
    </Suspense>
  );
}