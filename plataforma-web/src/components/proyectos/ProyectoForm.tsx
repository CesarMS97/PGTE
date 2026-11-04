'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProyectoFormProps {
  inmuebles: any[];
  action: (formData: FormData) => Promise<any>;
  defaultValues?: {
    inmueble_id?: string;
    titulo?: string;
    tipo_trabajo?: string;
    prioridad?: string;
    estado?: string;
    descripcion?: string;
  };
  isEditing?: boolean;
}

export function ProyectoForm({ inmuebles, action, defaultValues = {}, isEditing = false }: ProyectoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    // Solución definitiva para la fecha en Chile (UTC-3):
    // Obtenemos la fecha actual en formato ISO local (YYYY-MM-DDTHH:mm:ss) para que no haya desfase de día.
    if (!isEditing) {
      const ahoraChile = new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' });
      formData.append('fecha_solicitud', new Date(ahoraChile).toISOString());
    }

    try {
      const res = await action(formData);

      // Si la Server Action retorna éxito o se ejecuta correctamente
      if (!res || res.success !== false) {
        router.push('/dashboard/proyectos');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'No se pudo guardar el proyecto.');
      }
    } catch (error: any) {
      // Si la Server Action hace un redirect nativo de Next.js, capturamos el throw de redirección controlado
      if (error?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setErrorMsg(error.message || 'Ocurrió un error inesperado al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Selección de Inmueble */}
      <div>
        <label htmlFor="inmueble_id" className="block text-sm font-medium text-slate-700 mb-1">
          Inmueble Asociado <span className="text-red-500">*</span>
        </label>
        {inmuebles.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 space-y-2">
            <p>No tienes inmuebles registrados o disponibles para asociar.</p>
            <Link href="/dashboard/inmuebles/nuevo" className="inline-block font-medium underline text-amber-900">
              Registra un inmueble primero &rarr;
            </Link>
          </div>
        ) : (
          <select
            id="inmueble_id"
            name="inmueble_id"
            required
            defaultValue={defaultValues.inmueble_id || ''}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecciona un inmueble...</option>
            {inmuebles.map((inmueble: any) => (
              <option key={inmueble.id} value={inmueble.id}>
                {inmueble.nombre_referencia || inmueble.direccion} ({inmueble.clientes?.nombre || 'Sin cliente'})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Título del Proyecto */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-slate-700 mb-1">
          Título del Proyecto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          required
          defaultValue={defaultValues.titulo || ''}
          placeholder="Ej: Mantenimiento de Tablero General, Instalación de Red Eléctrica..."
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Tipo de Trabajo y Prioridad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tipo_trabajo" className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de Trabajo
          </label>
          <input
            type="text"
            id="tipo_trabajo"
            name="tipo_trabajo"
            defaultValue={defaultValues.tipo_trabajo || ''}
            placeholder="Ej: Eléctrico, Climatización, Certificación..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium text-slate-700 mb-1">
            Prioridad
          </label>
          <select
            id="prioridad"
            name="prioridad"
            defaultValue={defaultValues.prioridad || 'normal'}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="baja">Baja</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      {/* Estado Inicial */}
      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-slate-700 mb-1">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          defaultValue={defaultValues.estado || 'solicitado'}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="solicitado">Solicitado</option>
          <option value="en_proceso">En Proceso</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción / Observaciones
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          defaultValue={defaultValues.descripcion || ''}
          placeholder="Detalles adicionales sobre el alcance de la orden de trabajo..."
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Link
          href="/dashboard/proyectos"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading || inmuebles.length === 0}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
        </button>
      </div>

    </form>
  );
}