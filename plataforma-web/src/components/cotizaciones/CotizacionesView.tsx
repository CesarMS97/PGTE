'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileText, Plus, X, MessageSquare, Search, User, Building2, MapPin } from 'lucide-react';

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
  const [busqueda, setBusqueda] = useState('');

  // Filtrar los levantamientos según lo que escriba el usuario en el buscador
  const levantamientosFiltrados = levantamientos.filter((lev: any) => {
    if (!lev.proyecto_id) return false;
    const query = busqueda.toLowerCase();
    return (
      lev.cliente_nombre?.toLowerCase().includes(query) ||
      lev.inmueble_ref?.toLowerCase().includes(query) ||
      lev.inmueble_comuna?.toLowerCase().includes(query) ||
      lev.proyecto_titulo?.toLowerCase().includes(query) ||
      lev.tipo_instalacion?.toLowerCase().includes(query)
    );
  });

  const handleSeleccionarProyecto = (proyectoId: string) => {
    if (!proyectoId) return;
    router.push(`/dashboard/cotizaciones/nueva?proyectoId=${proyectoId}`);
  };

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
          onClick={() => {
            setBusqueda('');
            setIsModalOpen(true);
          }}
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

      {/* Modal de Selección con Buscador y Filtros Interactivos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header del Modal */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Seleccionar Levantamiento Técnico</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Busca y selecciona el terreno hecho en terreno para cotizar.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Búsqueda / Filtro */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filtrar por cliente, inmueble, comuna o proyecto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 focus:bg-white transition-colors outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Listado de Tarjetas Filtrables */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 bg-slate-50/50">
              {levantamientos.length === 0 ? (
                <div className="text-center py-12 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs font-medium">
                  No hay levantamientos disponibles para tu empresa.
                </div>
              ) : levantamientosFiltrados.length > 0 ? (
                levantamientosFiltrados.map((lev: any) => (
                  <div
                    key={lev.id}
                    onClick={() => handleSeleccionarProyecto(lev.proyecto_id)}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-100 uppercase">
                          {lev.tipo_instalacion || 'Instalación general'}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {lev.proyecto_titulo}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <User className="w-3.5 h-3.5 text-blue-600" /> {lev.cliente_nombre}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" /> {lev.inmueble_ref}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" /> {lev.inmueble_comuna}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 rounded-xl transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  No se encontraron levantamientos que coincidan con la búsqueda.
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}