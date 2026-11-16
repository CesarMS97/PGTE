'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Zap, 
  ShieldAlert
} from 'lucide-react';
import { 
  autoguardarLevantamiento, 
  finalizarLevantamiento, 
  obtenerLevantamientoPorVisita 
} from '@/services/levantamientos.service';

export default function NuevoLevantamientoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitaId = searchParams.get('visitaId');

  // Estados del formulario correspondientes al esquema Prisma
  const [tipoInstalacion, setTipoInstalacion] = useState('');
  const [tipoEmpalme, setTipoEmpalme] = useState('');
  const [tensionNominalV, setTensionNominalV] = useState('');
  const [potenciaContratadaKw, setPotenciaContratadaKw] = useState('');
  const [puestaTierra, setPuestaTierra] = useState<boolean>(true);
  const [resistenciaTierraOhm, setResistenciaTierraOhm] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Control de estado visual para autoguardado
  const [estadoGuardado, setEstadoGuardado] = useState<'guardado' | 'guardando' | 'cambios_pendientes'>('guardado');
  const [ultimoGuardado, setUltimoGuardado] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const estaCargandoInicial = useRef(true);

  // Cargar datos del borrador previo si existen
  useEffect(() => {
    if (!visitaId) return;

    async function cargarBorrador() {
      const res = await obtenerLevantamientoPorVisita(visitaId!);
      if (res.success && res.data) {
        setTipoInstalacion(res.data.tipo_instalacion || '');
        setTipoEmpalme(res.data.tipo_empalme || '');
        setTensionNominalV(res.data.tension_nominal_v ? res.data.tension_nominal_v.toString() : '');
        setPotenciaContratadaKw(res.data.potencia_contratada_kw ? res.data.potencia_contratada_kw.toString() : '');
        setPuestaTierra(res.data.puesta_tierra ?? true);
        setResistenciaTierraOhm(res.data.resistencia_tierra_ohm ? res.data.resistencia_tierra_ohm.toString() : '');
        setObservaciones(res.data.observaciones || '');
      }
      estaCargandoInicial.current = false;
    }

    cargarBorrador();
  }, [visitaId]);

  // Autoguardado con Debounce (Llamada al servicio en segundo plano)
  useEffect(() => {
    if (!visitaId || estaCargandoInicial.current) return;

    setEstadoGuardado('cambios_pendientes');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setEstadoGuardado('guardando');

      const res = await autoguardarLevantamiento({
        visitaId,
        tipoInstalacion,
        tipoEmpalme,
        tensionNominalV,
        potenciaContratadaKw,
        puestaTierra,
        resistenciaTierraOhm,
        observaciones,
      });

      if (res.success) {
        setEstadoGuardado('guardado');
        setUltimoGuardado(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setEstadoGuardado('cambios_pendientes');
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visitaId, tipoInstalacion, tipoEmpalme, tensionNominalV, potenciaContratadaKw, puestaTierra, resistenciaTierraOhm, observaciones]);

  // Manejador del botón final
  const handleGuardarDefinitivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitaId) {
      alert('Debes tener una visita técnica asociada para guardar el levantamiento.');
      return;
    }

    const res = await finalizarLevantamiento({
      visitaId,
      tipoInstalacion,
      tipoEmpalme,
      tensionNominalV,
      potenciaContratadaKw,
      puestaTierra,
      resistenciaTierraOhm,
      observaciones,
    });

    if (res.success) {
      router.push('/dashboard/levantamientos');
    } else {
      alert('Ocurrió un error al guardar el levantamiento.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Encabezado y barra de autoguardado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/levantamientos"
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Formulario de Levantamiento Técnico</h1>
              {visitaId && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Visita activa
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Registra los parámetros reales medidos en terreno.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          {estadoGuardado === 'guardando' && (
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Guardando borrador...
            </span>
          )}
          {estadoGuardado === 'cambios_pendientes' && (
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Cambios sin guardar
            </span>
          )}
          {estadoGuardado === 'guardado' && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Borrador guardado {ultimoGuardado && `(${ultimoGuardado})`}
            </span>
          )}
        </div>
      </div>

      {/* Formulario de captura */}
      <form onSubmit={handleGuardarDefinitivo} className="space-y-6">
        
        {/* Sección: Parámetros del Empalme y Red */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Parámetros Eléctricos Generales</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipo de Instalación</label>
              <input
                type="text"
                value={tipoInstalacion}
                onChange={(e) => setTipoInstalacion(e.target.value)}
                placeholder="Ej: Domiciliaria, Comercial, Industrial..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipo de Empalme</label>
              <select
                value={tipoEmpalme}
                onChange={(e) => setTipoEmpalme(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Seleccione tipo de empalme...</option>
                <option value="Monofásico">Monofásico</option>
                <option value="Trifásico">Trifásico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tensión Nominal (V)</label>
              <input
                type="number"
                step="0.01"
                value={tensionNominalV}
                onChange={(e) => setTensionNominalV(e.target.value)}
                placeholder="Ej: 220 o 380"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Potencia Contratada (kW)</label>
              <input
                type="number"
                step="0.01"
                value={potenciaContratadaKw}
                onChange={(e) => setPotenciaContratadaKw(e.target.value)}
                placeholder="Ej: 15.5"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resistencia Puesta a Tierra (Ω)</label>
              <input
                type="number"
                step="0.001"
                value={resistenciaTierraOhm}
                onChange={(e) => setResistenciaTierraOhm(e.target.value)}
                placeholder="Ej: 5.2"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">¿Cuenta con Puesta a Tierra?</label>
              <select
                value={puestaTierra ? 'true' : 'false'}
                onChange={(e) => setPuestaTierra(e.target.value === 'true')}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="true">Sí (Operativa)</option>
                <option value="false">No / Deficiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección: Observaciones Técnicas y Hallazgos */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Observaciones Técnicas y Hallazgos</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Detalle de protecciones, estado de conductores y anomalías</label>
            <textarea
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Describa el estado actual del tablero general, protecciones térmicas, diferenciales o cualquier hallazgo relevante en terreno..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/dashboard/levantamientos"
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Guardar y Salir
          </Link>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar y Finalizar Levantamiento
          </button>
        </div>

      </form>

    </div>
  );
}