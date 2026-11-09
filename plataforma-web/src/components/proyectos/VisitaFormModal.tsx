'use client';

import { useState } from 'react';
import { X, Calendar, AlignLeft } from 'lucide-react';
import { createVisitaTecnica } from '@/services/proyectos.service';

interface VisitaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyectoId: string;
}

export function VisitaFormModal({ isOpen, onClose, proyectoId }: VisitaFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.append('proyecto_id', proyectoId);
    
    // Forzamos el estado inicial fijo como 'programada' por regla de negocio
    formData.set('estado', 'programada');

    const fechaHoraInput = formData.get('fecha_programada') as string;
    if (fechaHoraInput) {
      formData.set('fecha_programada', `${fechaHoraInput}:00`);
    }

    try {
      const res = await createVisitaTecnica(formData);
      if (res && res.success) {
        formElement.reset();
        onClose();
      } else {
        setErrorMsg(res?.error || 'No se pudo guardar la visita.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Error inesperado al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Agendar Visita Técnica
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Fecha y Hora Programada <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="datetime-local"
                name="fecha_programada"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">La visita se registrará automáticamente en estado programada.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Motivo / Objetivo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <AlignLeft className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="motivo"
                required
                placeholder="Ej: Inspección inicial de tableros"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              rows={3}
              placeholder="Notas o instrucciones adicionales para la visita..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
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
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Visita'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}