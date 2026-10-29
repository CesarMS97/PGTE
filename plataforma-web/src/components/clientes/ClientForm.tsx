'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ClienteFormProps {
  initialData?: {
    id?: string;
    nombre: string;
    rut?: string;
    telefono?: string;
    email?: string;
    observaciones?: string;
  };
  isEditing?: boolean;
}

export function ClienteForm({ initialData, isEditing = false }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    rut: initialData?.rut || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    observaciones: initialData?.observaciones || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando datos del cliente:', formData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Nombre o Razón Social <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej. Constructora del Norte"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              RUT
            </label>
            <input 
              type="text" 
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
              placeholder="78699566-K"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Teléfono
            </label>
            <input 
              type="tel" 
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+56985697542"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Correo Electrónico
          </label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="constructoradelnorte@gmail.com"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Observaciones
          </label>
          <textarea 
            rows={3}
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Instalación de cableado en oficinas nuevas..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/dashboard/clientes"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all"
          >
            {isEditing ? 'Guardar cambios' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}