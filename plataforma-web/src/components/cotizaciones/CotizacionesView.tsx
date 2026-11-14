'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileText, Plus, X, MessageSquare } from 'lucide-react';

interface CotizacionesViewProps {
  cotizaciones: any[];
  levantamientos: any[];
}

// WhatsApp necesita solo dígitos y código de país
function telefonoParaWhatsApp(telefono: string | null | undefined): string {
  const digitos = (telefono || '').replace(/\D/g, '');
  if (!digitos) return '';
  return digitos.length === 9 && digitos.startsWith('9') ? `56${digitos}` : digitos;
}

export function CotizacionesView({ cotizaciones, levantamientos }: CotizacionesViewProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProyectoId, setSelectedProyectoId] = useState('');

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Cabecera */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Módulo de Cotizaciones</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestión centralizada de presupuestos, materiales, mano de obra y costos comerciales.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Cotización
        </button>
      </div>

      {/* Listado Principal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Historial de Presupuestos</h3>
          <span className="text-xs text-slate-400 font-medium">
            {cotizaciones.length} cotizaciones registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 text-slate-400 uppercase font-semibold border-b border-slate-100 tracking-wider">
              <tr>
                <th className="p-4">Folio</th>
                <th className="p-4">Proyecto / Cliente</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Total (CLP)</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cotizaciones.length > 0 ? (
                cotizaciones.map((cot: any) => {
                  const proyecto = cot.proyectos;
                  const inmueble = proyecto?.inmuebles;
                  const cliente = inmueble?.clientes;
                  const telefonoCliente = telefonoParaWhatsApp(cliente?.telefono);
                  const totalMonto = Number(cot.total || 0).toLocaleString('es-CL');

                  const whatsappUrl = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(
                    `Hola, le escribo para compartirle el envío de su cotización (${cot.numero}) correspondiente al proyecto "${proyecto?.titulo || 'eléctrico'}". El total del presupuesto es de $${totalMonto} (IVA incluido). Quedo atento a cualquier duda.`
                  )}`;

                  return (
                    <tr key={cot.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-blue-600">{cot.numero}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{proyecto?.titulo || 'Sin Proyecto'}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {cliente?.nombre || 'Cliente N/A'} — {inmueble?.comuna || 'Sin comuna'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          GENERADA
                        </span>
                      </td>
                      <td className="p-4 text-right font-extrabold text-slate-900">
                        ${totalMonto}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/dashboard/cotizaciones/nueva?proyectoId=${cot.proyecto_id}`}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold px-3 py-1.5 rounded-xl transition-colors"
                            title="Ver / Editar"
                          >
                            Ver / Editar <ArrowRight className="w-3 h-3" />
                          </Link>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                            title="Enviar por WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-medium">
                    No hay cotizaciones registradas en el sistema todavía. Haz clic en <span className="text-blue-600 font-bold">"Nueva Cotización"</span> para crear la primera.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Selección */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Seleccionar Levantamiento Técnico</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Elige el levantamiento hecho en terreno para cotizar.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-600 font-medium">
                Levantamientos Disponibles ({levantamientos.length})
              </label>

              {levantamientos.length === 0 && (
                <p className="text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  No hay levantamientos disponibles para tu empresa.
                </p>
              )}

              <select
                value={selectedProyectoId}
                onChange={(e) => setSelectedProyectoId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 focus:bg-white transition-colors"
              >
                <option value="">-- Selecciona un levantamiento --</option>
                {levantamientos.map((lev: any) => {
                  if (!lev.proyecto_id) return null;
                  const tituloLev = lev.tipo_instalacion
                    ? `Levantamiento: ${lev.tipo_instalacion}`
                    : lev.proyecto_titulo;

                  return (
                    <option key={lev.id} value={lev.proyecto_id}>
                      {tituloLev} — {lev.cliente_nombre} ({lev.inmueble_comuna})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedProyectoId}
                onClick={() => {
                  if (selectedProyectoId) {
                    // Navegación del cliente: no recarga toda la aplicación
                    router.push(`/dashboard/cotizaciones/nueva?proyectoId=${selectedProyectoId}`);
                  }
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                Generar Cotización →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}