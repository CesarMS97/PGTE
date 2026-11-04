'use client';

import { useState } from 'react';
import { X, ClipboardCheck, Zap, Shield, Activity } from 'lucide-react';
import { createLevantamiento } from '@/services/proyectos.service';

interface LevantamientoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyectoId: string;
  visitas: Array<{ id: string; motivo: string | null; fecha_programada: Date | string | null }>;
}

export function LevantamientoFormModal({ isOpen, onClose, proyectoId, visitas }: LevantamientoFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.append('proyecto_id', proyectoId);

    try {
      const res = await createLevantamiento(formData);
      if (res && res.success) {
        onClose();
      } else {
        setErrorMsg(res?.error || 'No se pudo guardar el levantamiento.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Error inesperado al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            Nuevo Levantamiento Técnico Eléctrico
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Asociar a Visita Técnica *
            </label>
            <select
              name="visita_id"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
            >
              <option value="">Seleccione una visita técnica...</option>
              {visitas?.map((visita) => (
                <option key={visita.id} value={visita.id}>
                  {visita.motivo || 'Visita técnica'} ({visita.fecha_programada ? new Date(visita.fecha_programada).toLocaleDateString() : 'Sin fecha'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tipo de Instalación
              </label>
              <input
                type="text"
                name="tipo_instalacion"
                placeholder="Ej: Tablero General / Red de Distribución"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tipo de Empalme
              </label>
              <input
                type="text"
                name="tipo_empalme"
                placeholder="Ej: Monofásico BT / Trifásico"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tensión Nominal (V)
              </label>
              <input
                type="number"
                step="0.01"
                name="tension_nominal_v"
                placeholder="Ej: 380"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Potencia Contratada (kW)
              </label>
              <input
                type="number"
                step="0.01"
                name="potencia_contratada_kw"
                placeholder="Ej: 15.5"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Resistencia Tierra (Ω)
              </label>
              <input
                type="number"
                step="0.001"
                name="resistencia_tierra_ohm"
                placeholder="Ej: 5.2"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              ¿Cuenta con Puesta a Tierra?
            </label>
            <select
              name="puesta_tierra"
              defaultValue="true"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
            >
              <option value="true">Sí (Operativa)</option>
              <option value="false">No / Deficiente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Observaciones Técnicas
            </label>
            <textarea
              name="observaciones"
              rows={3}
              placeholder="Detalles sobre protecciones, estado de conductores, anomalías..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || visitas.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Levantamiento'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}