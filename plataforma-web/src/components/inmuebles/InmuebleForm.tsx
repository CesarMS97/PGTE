'use client';

import { createInmueble, updateInmueble } from '@/services/inmuebles.service';
import Link from 'next/link';

interface ClienteOption {
  id: string;
  nombre: string;
  email: string | null;
}

interface InmuebleFormProps {
  clientes: ClienteOption[];
  inmueble?: any; // Si existe, estamos editando
}

export function InmuebleForm({ clientes, inmueble }: InmuebleFormProps) {
  const isEditing = !!inmueble;
  const handleSubmit = isEditing ? updateInmueble.bind(null, inmueble.id) : createInmueble;

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente Propietario */}
        <div className="md:col-span-2">
          <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-700 mb-1">
            Cliente Propietario *
          </label>
          <select
            id="cliente_id"
            name="cliente_id"
            required
            defaultValue={inmueble?.cliente_id || ''}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="" disabled>-- Seleccione un cliente --</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.email ? `(${cliente.email})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre de Referencia */}
        <div>
          <label htmlFor="nombre_referencia" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Referencia
          </label>
          <input
            type="text"
            id="nombre_referencia"
            name="nombre_referencia"
            defaultValue={inmueble?.nombre_referencia || ''}
            placeholder="Ej: Sucursal Norte, Casa Matriz"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tipo de Uso */}
        <div>
          <label htmlFor="tipo_uso" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Uso
          </label>
          <select
            id="tipo_uso"
            name="tipo_uso"
            defaultValue={inmueble?.tipo_uso || 'Residencial'}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Oficina">Oficina</option>
          </select>
        </div>

        {/* Dirección */}
        <div className="md:col-span-2">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            required
            defaultValue={inmueble?.direccion || ''}
            placeholder="Ej: Av. Providencia 1234, Depto 502"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Comuna */}
        <div>
          <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">
            Comuna *
          </label>
          <input
            type="text"
            id="comuna"
            name="comuna"
            required
            defaultValue={inmueble?.comuna || ''}
            placeholder="Ej: Santiago"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Región */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Región
          </label>
          <input
            type="text"
            id="region"
            name="region"
            defaultValue={inmueble?.region || ''}
            placeholder="Ej: Metropolitana"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Material de Construcción */}
        <div>
          <label htmlFor="material_construccion" className="block text-sm font-medium text-gray-700 mb-1">
            Material de Construcción
          </label>
          <input
            type="text"
            id="material_construccion"
            name="material_construccion"
            defaultValue={inmueble?.material_construccion || ''}
            placeholder="Ej: Hormigón armado, Albañilería"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Superficie m2 */}
        <div>
          <label htmlFor="superficie_m2" className="block text-sm font-medium text-gray-700 mb-1">
            Superficie (m²)
          </label>
          <input
            type="number"
            step="0.01"
            id="superficie_m2"
            name="superficie_m2"
            defaultValue={inmueble?.superficie_m2 || ''}
            placeholder="Ej: 120.50"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Antigüedad (Años) */}
        <div>
          <label htmlFor="antiguedad_anios" className="block text-sm font-medium text-gray-700 mb-1">
            Antigüedad (Años)
          </label>
          <input
            type="number"
            id="antiguedad_anios"
            name="antiguedad_anios"
            defaultValue={inmueble?.antiguedad_anios || ''}
            placeholder="Ej: 5"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Estado Activo (Solo en edición) */}
        {isEditing && (
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              defaultChecked={inmueble?.activo ?? true}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="activo" className="text-sm font-medium text-gray-700">
              Inmueble Activo
            </label>
          </div>
        )}

        {/* Observaciones */}
        <div className="md:col-span-2">
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={3}
            defaultValue={inmueble?.observaciones || ''}
            placeholder="Notas o detalles adicionales..."
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Link
          href="/dashboard/inmuebles"
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {isEditing ? 'Actualizar Inmueble' : 'Guardar Inmueble'}
        </button>
      </div>
    </form>
  );
}