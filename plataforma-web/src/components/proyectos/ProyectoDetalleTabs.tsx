'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProyecto } from '@/services/proyectos.service';
import { PrioridadBadge, EstadoBadge } from '@/components/proyectos/ProyectoBadges';
import { VisitaFormModal } from '@/components/proyectos/VisitaFormModal';
import { LevantamientoFormModal } from '@/components/proyectos/LevantamientoFormModal';
import { 
  Building2, 
  User, 
  FileText, 
  ClipboardCheck, 
  Wrench, 
  Plus,
  Calendar,
  Zap,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  Trash2
} from 'lucide-react';

// Helper blindado para formatear fechas extrayendo directamente los componentes UTC (evita desfases locales/servidor)
function formatearFechaChile(fecha: string | Date | null | undefined): string {
  if (!fecha) return 'N/A';
  const d = new Date(fecha);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

interface ProyectoDetalleTabsProps {
  proyecto: any;
}

export function ProyectoDetalleTabs({ proyecto }: ProyectoDetalleTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'visitas' | 'levantamientos'>('general');
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);
  const [isLevantamientoModalOpen, setIsLevantamientoModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const inmueble = proyecto.inmuebles;
  const cliente = inmueble?.clientes;
  const tecnicoProyecto = proyecto.perfiles;
  const visitas = proyecto.visitas_tecnicas || [];
  
  // Levantamientos extraídos de las visitas
  const levantamientos = visitas
    .map((v: any) => v.levantamientos ? { ...v.levantamientos, visitaMotivo: v.motivo, visitaFecha: v.fecha_programada } : null)
    .filter(Boolean);

  // Fecha real de la solicitud específica de este proyecto
  const fechaRealProyecto = proyecto.fecha_solicitud || proyecto.created_at;

  // Función para manejar la eliminación del proyecto
  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteProyecto(proyecto.id);
      if (res.success) {
        router.push('/dashboard/proyectos');
        router.refresh();
      } else {
        alert(res.error || 'No se pudo eliminar el proyecto.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Ocurrió un error inesperado al eliminar el proyecto.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera Principal del Proyecto */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{proyecto.titulo}</h1>
              <EstadoBadge estado={proyecto.estado} />
              <PrioridadBadge prioridad={proyecto.prioridad} />
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {proyecto.tipo_trabajo ? `Tipo de Servicio: ${proyecto.tipo_trabajo}` : 'Orden de trabajo técnica'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              📅 Solicitado: {formatearFechaChile(fechaRealProyecto)}
            </span>

            {/* Botón para eliminar proyecto */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              title="Eliminar este proyecto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>

        {/* Resumen Inmueble / Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-sm">
          <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Inmueble / Ubicación</p>
              <p className="font-bold text-slate-800 text-base mt-0.5">
                {inmueble?.nombre_referencia || inmueble?.direccion || 'Inmueble sin nombre'}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {inmueble?.direccion || ''} {inmueble?.comuna ? `- ${inmueble.comuna}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cliente Asignado</p>
              <p className="font-bold text-slate-800 text-base mt-0.5">
                {cliente?.nombre || 'Sin cliente asignado'}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                {cliente?.telefono && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {cliente.telefono}
                  </span>
                )}
                {cliente?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {cliente.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 shadow-xs">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            General & Resumen
          </button>

          <button
            onClick={() => setActiveTab('visitas')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'visitas'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Visitas Técnicas ({visitas.length})
          </button>

          <button
            onClick={() => setActiveTab('levantamientos')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'levantamientos'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Levantamientos ({levantamientos.length})
          </button>
        </nav>
      </div>

      {/* Contenido según pestaña */}
      <div className="bg-white rounded-b-xl border border-slate-200 shadow-sm p-6">
        
        {/* PESTAÑA GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            
            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50/50 to-white p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Visitas Registradas</span>
                  <Wrench className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{visitas.length}</p>
                <p className="text-xs text-slate-500 mt-1">Inspecciones técnicas en terreno</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/50 to-white p-4 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Levantamientos</span>
                  <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{levantamientos.length}</p>
                <p className="text-xs text-slate-500 mt-1">Parámetros eléctricos ingresados</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50/50 to-white p-4 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Técnico Responsable</span>
                  <User className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-base font-bold text-slate-900 mt-2 truncate">
                  {tecnicoProyecto ? `${tecnicoProyecto.nombre || ''} ${tecnicoProyecto.apellido || ''}`.trim() : 'No asignado'}
                </p>
                <p className="text-xs text-slate-500 mt-1">{tecnicoProyecto?.email || 'Sin correo asociado'}</p>
              </div>
            </div>

            {/* Bloque de Descripción y Cronograma */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Descripción y Alcance del Proyecto
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {proyecto.descripcion || 'Este proyecto no cuenta con una descripción detallada ingresada.'}
                  </p>
                </div>

                {inmueble && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      Ficha Técnica del Inmueble Asociado
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block font-medium">Tipo de Uso</span>
                        <span className="font-bold text-slate-800">{inmueble.tipo_uso || 'No especificado'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block font-medium">Superficie</span>
                        <span className="font-bold text-slate-800">{inmueble.superficie_m2 ? `${inmueble.superficie_m2} m²` : 'N/A'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block font-medium">Antigüedad</span>
                        <span className="font-bold text-slate-800">{inmueble.antiguedad_anios ? `${inmueble.antiguedad_anios} años` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Lateral de Cronograma */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Cronograma del Proyecto
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Fecha Solicitud:</span>
                    <span className="font-bold text-slate-800">
                      {formatearFechaChile(fechaRealProyecto)}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Inicio Estimado:</span>
                    <span className="font-bold text-slate-800">
                      {proyecto.fecha_inicio ? formatearFechaChile(proyecto.fecha_inicio) : 'Por definir'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Término Estimado:</span>
                    <span className="font-bold text-slate-800">
                      {proyecto.fecha_termino ? formatearFechaChile(proyecto.fecha_termino) : 'Por definir'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA VISITAS TÉCNICAS */}
        {activeTab === 'visitas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Visitas Técnicas Agendadas</h3>
                <p className="text-xs text-slate-500">Historial real de inspecciones en terreno.</p>
              </div>
              <button
                onClick={() => setIsVisitaModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Agendar Visita
              </button>
            </div>

            {visitas.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 mt-4">
                {visitas.map((visita: any) => (
                  <div key={visita.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{visita.motivo || 'Visita técnica general'}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          {formatearFechaChile(visita.fecha_programada)}
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full text-[11px] capitalize border border-indigo-100">
                          {visita.estado || 'programada'}
                        </span>
                      </div>
                      {visita.observaciones && (
                        <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
                          <span className="font-semibold text-slate-700">Observaciones:</span> {visita.observaciones}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-700 font-medium">No hay visitas técnicas agendadas para este proyecto aún.</p>
                <p className="text-xs text-slate-400 mt-1">Haz clic en "Agendar Visita" para registrar la primera inspección.</p>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA LEVANTAMIENTOS TÉCNICOS */}
        {activeTab === 'levantamientos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Levantamientos Eléctricos Técnicos</h3>
                <p className="text-xs text-slate-500">Parámetros eléctricos reales ingresados en terreno.</p>
              </div>
              <button
                onClick={() => setIsLevantamientoModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo Levantamiento
              </button>
            </div>

            {levantamientos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {levantamientos.map((lev: any) => (
                  <div key={lev.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{lev.tipo_instalacion || 'Instalación Eléctrica'}</h4>
                          <p className="text-xs text-slate-500">Asociado a visita: <span className="font-medium text-slate-700">{lev.visitaMotivo || 'Visita técnica'}</span> ({formatearFechaChile(lev.visitaFecha)})</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${lev.puesta_tierra ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {lev.puesta_tierra ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {lev.puesta_tierra ? 'Con Puesta a Tierra' : 'Sin Puesta a Tierra'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Tipo Empalme</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{lev.tipo_empalme || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Tensión Nominal</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{lev.tension_nominal_v ? `${lev.tension_nominal_v} V` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Potencia Contratada</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{lev.potencia_contratada_kw ? `${lev.potencia_contratada_kw} kW` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Resistencia Tierra</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{lev.resistencia_tierra_ohm ? `${lev.resistencia_tierra_ohm} Ω` : 'N/A'}</span>
                      </div>
                    </div>

                    {lev.observaciones && (
                      <p className="text-xs text-slate-600 bg-slate-50/60 p-3 rounded-lg border border-slate-100 leading-relaxed">
                        <span className="font-bold text-slate-700">Observaciones Técnicas:</span> {lev.observaciones}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-700 font-medium">No hay levantamientos técnicos registrados todavía.</p>
                <p className="text-xs text-slate-400 mt-1">
                  {visitas.length === 0 
                    ? '⚠️ Debe agendar una visita técnica antes de poder registrar parámetros eléctricos.' 
                    : 'Haz clic en "Nuevo Levantamiento" para guardar los datos de terreno.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Componentes Modales */}
      <VisitaFormModal
        isOpen={isVisitaModalOpen}
        onClose={() => setIsVisitaModalOpen(false)}
        proyectoId={proyecto.id}
      />

      <LevantamientoFormModal
        isOpen={isLevantamientoModalOpen}
        onClose={() => setIsLevantamientoModalOpen(false)}
        proyectoId={proyecto.id}
        visitas={visitas}
      />

    </div>
  );
}