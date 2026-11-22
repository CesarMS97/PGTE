import { connection } from 'next/server';
import { CotizacionRapidaView } from '@/components/cotizaciones/CotizacionRapidaView';
import { Zap } from 'lucide-react';

export const instant = false;

export const metadata = {
  title: 'Cotización Rápida | PGTE',
  description: 'Generador rápido de presupuestos sin registro previo',
};

export default async function CotizacionRapidaPage() {
  await connection();

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Cotización Rápida Express
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Arma un presupuesto al instante para descargar en PDF o enviar por WhatsApp sin crear cliente ni proyecto.
        </p>
      </div>

      <CotizacionRapidaView />
    </div>
  );
}   