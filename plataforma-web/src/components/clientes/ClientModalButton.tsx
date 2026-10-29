'use client';

import { useState, useTransition } from 'react';
import { crearCliente } from '@/services/clientes.service';

interface ClientModalButtonProps {
  empresaId: string;
}

export default function ClientModalButton({ empresaId }: ClientModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      empresa_id: empresaId,
      nombre: formData.get('nombre'),
      rut: formData.get('rut'),
      telefono: formData.get('telefono'),
      email: formData.get('email'),
      observaciones: formData.get('observaciones'),
    };

    startTransition(async () => {
      const result = await crearCliente(data);
      if (!result.success) {
        setError(result.error || 'Ocurrió un error al registrar el cliente.');
      } else {
        setSuccessMessage('¡Cliente registrado con éxito!');
        setTimeout(() => {
          setIsOpen(false);
          setSuccessMessage(null);
          // Opcional: limpiar formulario o recargar ventana si es necesario
          window.location.reload();
        }, 1000);
      }
    });
  };

  return (
    <>
      {/* Botón principal con el azul corporativo de la landing */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nuevo cliente
      </button>

      {/* Modal flotante */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Cabecera del Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">Módulo de Clientes</span>
                <h3 className="text-lg font-bold text-gray-900">Registrar nuevo cliente</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/55 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-3 text-sm text-green-700 bg-green-50 rounded-xl border border-green-200">
                  {successMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Nombre o Razón Social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Ej. Constructora del Sur Ltda."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">RUT</label>
                  <input
                    type="text"
                    name="rut"
                    placeholder="Ej. 12.345.678-9"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Ej. +56912345678"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contacto@empresa.cl"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Observaciones</label>
                <textarea
                  name="observaciones"
                  rows={3}
                  placeholder="Notas adicionales sobre el cliente..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {isPending ? 'Guardando...' : 'Guardar cliente'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}