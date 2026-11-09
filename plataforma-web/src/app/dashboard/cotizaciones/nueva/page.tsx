import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { obtenerContextoUsuarioActual } from '@/services/auth.service';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { CotizacionFormView } from '@/components/cotizaciones/CotizacionFormView';

interface PageProps {
  searchParams: Promise<{ proyectoId?: string }>;
}

async function NuevaCotizacionContent({ searchParams }: PageProps) {
  await connection();

  const { proyectoId: idEntrada } = await searchParams;

  if (!idEntrada || idEntrada === 'undefined') {
    redirect('/dashboard/cotizaciones');
  }

  const contexto = await obtenerContextoUsuarioActual();
  if (!contexto) redirect('/dashboard/cotizaciones');

  // 1. Buscar el proyecto con Prisma (mismo criterio de acceso que el selector)
  const filtroCliente = contexto.empresaId
    ? { empresa_id: contexto.empresaId }
    : contexto.esIndependiente
    ? { tecnico_id: contexto.perfilId }
    : undefined;

  const proyecto = await prisma.proyectos.findFirst({
    where: {
      id: idEntrada,
      ...(filtroCliente ? { inmuebles: { clientes: filtroCliente } } : {}),
    },
    include: {
      inmuebles: { include: { clientes: true } },
    },
  });

  if (!proyecto) {
    console.error('[nueva] proyecto no encontrado o sin acceso:', idEntrada);
    redirect('/dashboard/cotizaciones');
  }

  const proyectoIdFinal = proyecto.id;
  const cliente = proyecto.inmuebles?.clientes;

  // 2. Obtener o crear cotización en borrador
  const supabase = await createClient();

  let { data: cotizacion, error: errCot } = await supabase
    .from('cotizaciones')
    .select('*, cotizacion_items(*)')
    .eq('proyecto_id', proyectoIdFinal)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errCot) console.error('[nueva] error leyendo cotización:', errCot);

  if (!cotizacion) {
    const numeroFolio = `COT-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: nuevaCotizacion, error: errInsert } = await supabase
      .from('cotizaciones')
      .insert({
        proyecto_id: proyectoIdFinal,
        numero: numeroFolio,
        version: 1,
        estado: 'borrador',
        subtotal_materiales: 0,
        subtotal_mano_obra: 0,
        otros_costos: 0,
        utilidad_porcentaje: 0,
        utilidad_monto: 0,
        impuestos_monto: 0,
        total: 0,
      })
      .select('*, cotizacion_items(*)')
      .single();

    if (errInsert) console.error('[nueva] error creando cotización:', errInsert);
    cotizacion = nuevaCotizacion;
  }

  if (!cotizacion) {
    console.error('[nueva] no hay cotización; probable RLS en cotizaciones');
    redirect('/dashboard/cotizaciones');
  }

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
              Proyecto: <span className="font-semibold text-slate-700">{proyecto.titulo}</span> — Cliente:{' '}
              <span className="font-semibold text-slate-700">{cliente?.nombre || 'N/A'}</span>
            </p>
          </div>

          <a
            href="/dashboard/cotizaciones"
            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            ← Volver a Cotizaciones
          </a>
        </div>

        <CotizacionFormView proyectoId={proyectoIdFinal} initialCotizacion={cotizacion} />
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