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

  // Extraer la lista única de clientes a partir de los inmuebles disponibles
  const clientesMap = new Map();
  inmuebles.forEach((inm) => {
    if (inm.clientes) {
      clientesMap.set(inm.clientes.id, inm.clientes);
    }
  });
  const clientes = Array.from(clientesMap.values()).sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));

  // Preseleccionar cliente si estamos editando o si viene un inmueble por defecto
  const inmuebleInicial = inmuebles.find((i) => i.id === defaultValues.inmueble_id);
  const [clienteIdSeleccionado, setClienteIdSeleccionado] = useState<string>(
    inmuebleInicial?.clientes?.id || ''
  );
  const [inmuebleIdSeleccionado, setInmuebleIdSeleccionado] = useState<string>(
    defaultValues.inmueble_id || ''
  );

  // Filtrar los inmuebles que pertenecen exclusivamente al cliente seleccionado
  const inmueblesFiltrados = inmuebles.filter(
    (inm) => inm.clientes?.id === clienteIdSeleccionado
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.set('inmueble_id', inmuebleIdSeleccionado);

    if (!isEditing) {
      const ahoraChile = new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' });
      formData.append('fecha_solicitud', new Date(ahoraChile).toISOString());
    }

    try {
      const res = await action(formData);

      if (!res || res.success !== false) {
        router.push('/dashboard/proyectos');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'No se pudo guardar el proyecto.');
      }
    } catch (error: any) {
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

      {inmuebles.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 space-y-2">
          <p>No tienes inmuebles registrados o disponibles para asociar.</p>
          <Link href="/dashboard/inmuebles/nuevo" className="inline-block font-medium underline text-amber-900">
            Registra un inmueble primero &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Paso 1: Selección de Cliente */}
          <div>
            <label htmlFor="cliente_filtro" className="block text-sm font-medium text-slate-700 mb-1">
              1. Seleccionar Cliente <span className="text-red-500">*</span>
            </label>
            <select
              id="cliente_filtro"
              value={clienteIdSeleccionado}
              onChange={(e) => {
                setClienteIdSeleccionado(e.target.value);
                setInmuebleIdSeleccionado(''); // Reiniciar inmueble al cambiar de cliente
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona un cliente...</option>
              {clientes.map((cliente: any) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Paso 2: Selección de Inmueble (Dependiente del cliente) */}
          <div>
            <label htmlFor="inmueble_id" className="block text-sm font-medium text-slate-700 mb-1">
              2. Seleccionar Inmueble <span className="text-red-500">*</span>
            </label>
            <select
              id="inmueble_id"
              name="inmueble_id"
              required
              value={inmuebleIdSeleccionado}
              onChange={(e) => setInmuebleIdSeleccionado(e.target.value)}
              disabled={!clienteIdSeleccionado}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!clienteIdSeleccionado
                  ? '← Primero selecciona un cliente...'
                  : inmueblesFiltrados.length === 0
                  ? 'Este cliente no tiene inmuebles'
                  : 'Selecciona un inmueble...'}
              </option>
              {inmueblesFiltrados.map((inmueble: any) => (
                <option key={inmueble.id} value={inmueble.id}>
                  {inmueble.nombre_referencia || inmueble.direccion} ({inmueble.comuna || 'Sin comuna'})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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