'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { crearCliente, actualizarCliente } from '@/services/clientes.service';

interface ClienteFormProps {
  initialData?: {
    nombre: string;
    rut?: string;
    telefono?: string;
    email?: string;
    observaciones?: string;
  };
  clienteId?: string; // ID recibido por separado para asegurar la edición exacta
  isEditing?: boolean;
}

export function ClienteForm({ initialData, clienteId, isEditing = false }: ClienteFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    rut: initialData?.rut || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    observaciones: initialData?.observaciones || '',
  });

  // Asegura que el formulario cargue los datos frescos al cambiar de cliente
  useEffect(() => {
    setFormData({
      nombre: initialData?.nombre || '',
      rut: initialData?.rut || '',
      telefono: initialData?.telefono || '',
      email: initialData?.email || '',
      observaciones: initialData?.observaciones || '',
    });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      try {
        let resultado;
        
        // Si estamos editando y tenemos el ID, llamamos a actualizarCliente
        if (isEditing && clienteId) {
          resultado = await actualizarCliente(clienteId, formData);
        } else {
          resultado = await crearCliente(formData);
        }

        if (resultado && !resultado.success) {
          setErrorMessage(resultado.error || 'Ocurrió un error al guardar.');
          return;
        }

        formRef.current?.reset();
        setFormData({ nombre: '', rut: '', telefono: '', email: '', observaciones: '' });
        
        router.push('/dashboard/clientes');
        router.refresh();
      } catch (error: any) {
        if (error?.message === "NEXT_REDIRECT") throw error;
        setErrorMessage('Ocurrió un error inesperado al procesar la solicitud.');
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {errorMessage}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Nombre o Razón Social <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            required
            autoComplete="off"
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
              autoComplete="off"
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
              placeholder="78.699.566-K"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Teléfono
            </label>
            <input 
              type="tel" 
              autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Guardar Cliente')}
          </button>
        </div>
      </form>
    </div>
  );
}