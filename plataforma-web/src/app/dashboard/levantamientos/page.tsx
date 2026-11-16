'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ClipboardList, 
  Calendar, 
  Building2, 
  User, 
  Plus, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  obtenerDatosInicialesLevantamientos,
  obtenerInmueblesPorCliente, 
  obtenerVisitasPorInmueble,
} from '@/services/levantamientos.service';

export default function LevantamientosPage() {
  const [visitasDelDia, setVisitasDelDia] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [inmuebles, setInmuebles] = useState<any[]>([]);
  const [visitasInmueble, setVisitasInmueble] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState('');
  const [visitaSeleccionada, setVisitaSeleccionada] = useState('');

  useEffect(() => {
    async function cargarDatosIniciales() {
      // Una sola server action (las 3 consultas se ejecutan en paralelo en el servidor)
      const datos = await obtenerDatosInicialesLevantamientos();

      setVisitasDelDia(datos.visitasDelDia);
      setClientes(datos.clientes);
      setHistorial(datos.historial);
    }

    cargarDatosIniciales();
  }, []);

  const handleCambioCliente = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idCliente = e.target.value;
    setClienteSeleccionado(idCliente);
    setInmuebleSeleccionado('');
    setVisitaSeleccionada('');
    setInmuebles([]);
    setVisitasInmueble([]);

    if (idCliente) {
      const res = await obtenerInmueblesPorCliente(idCliente);
      if (res.success) setInmuebles(res.data);
    }
  };

  const handleCambioInmueble = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idInmueble = e.target.value;
    setInmuebleSeleccionado(idInmueble);
    setVisitaSeleccionada('');
    setVisitasInmueble([]);

    if (idInmueble) {
      const res = await obtenerVisitasPorInmueble(idInmueble);
      if (res.success) setVisitasInmueble(res.data);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Levantamientos Técnicos</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Gestión de inspecciones en terreno, parámetros eléctricos y borradores de trabajo.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 1: Visitas Técnicas de Hoy */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0D2345] text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold">Visitas Programadas para Hoy</h2>
          </div>
          <span className="text-xs bg-white/10 text-yellow-300 font-semibold px-3 py-1 rounded-full border border-white/10">
            {visitasDelDia.length} programadas
          </span>
        </div>

        {visitasDelDia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitasDelDia.map((visita: any) => {
              const inmueble = visita.proyectos?.inmuebles;
              const cliente = inmueble?.clientes;
              const fechaHora = visita.fecha_programada ? new Date(visita.fecha_programada) : null;

              return (
                <div key={visita.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-3 hover:bg-white/15 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                        {fechaHora ? fechaHora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : 'Sin hora'} hrs
                      </span>
                      <h3 className="font-bold text-base text-white mt-0.5">{visita.motivo || visita.proyectos?.titulo || 'Visita Técnica'}</h3>
                    </div>
                    <span className="p-1.5 bg-blue-600/40 text-blue-200 rounded-lg">
                      <Zap className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {cliente?.nombre || 'Cliente sin nombre'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {inmueble?.direccion || 'Dirección no especificada'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400 capitalize">Estado: {visita.estado || 'Pendiente'}</span>
                    <Link
                      href={`/dashboard/levantamientos/nuevo?visitaId=${visita.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      Iniciar Levantamiento
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center bg-white/5 rounded-xl border border-white/5 text-slate-300 text-sm">
            No tienes visitas técnicas programadas para el día de hoy.
          </div>
        )}
      </div>

      {/* Sección 2: Búsqueda y Filtros en Cascada */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Búsqueda y Filtros Jerárquicos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">1. Seleccionar Cliente</label>
            <select 
              value={clienteSeleccionado}
              onChange={handleCambioCliente}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Seleccione un cliente...</option>
              {clientes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">2. Seleccionar Inmueble</label>
            <select 
              value={inmuebleSeleccionado}
              onChange={handleCambioInmueble}
              disabled={!clienteSeleccionado}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">Seleccione inmueble...</option>
              {inmuebles.map((i: any) => (
                <option key={i.id} value={i.id}>{i.direccion} ({i.comuna})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">3. Seleccionar Visita Técnica</label>
            <select 
              value={visitaSeleccionada}
              onChange={(e) => setVisitaSeleccionada(e.target.value)}
              disabled={!inmuebleSeleccionado}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">Seleccione visita...</option>
              {visitasInmueble.map((v: any) => (
                <option key={v.id} value={v.id}>
                  {v.fecha_programada ? new Date(v.fecha_programada).toLocaleDateString('es-CL') : 'Sin fecha'} - {v.motivo || 'Visita'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Link
            href={visitaSeleccionada ? `/dashboard/levantamientos/nuevo?visitaId=${visitaSeleccionada}` : '#'}
            onClick={(e) => { if (!visitaSeleccionada) e.preventDefault(); }}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-5 rounded-lg transition-colors shadow-sm flex items-center gap-2 ${!visitaSeleccionada ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Plus className="w-4 h-4" />
            Ir a Formulario de Levantamiento
          </Link>
        </div>
      </div>

      {/* Sección 3: Historial y Listado General */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Historial de Levantamientos Registrados</h2>

        {historial.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {historial.map((lev: any) => {
              const visita = lev.visitas_tecnicas;
              const inmueble = visita?.proyectos?.inmuebles;
              const cliente = inmueble?.clientes;

              return (
                <div key={lev.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Instalación {lev.tipo_instalacion || 'Eléctrica'} ({lev.tipo_empalme || 'No especificado'})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cliente: <span className="font-medium text-slate-700">{cliente?.nombre || 'N/A'}</span> • Inmueble: <span className="font-medium text-slate-700">{inmueble?.direccion || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      📅 {new Date(lev.updated_at).toLocaleDateString('es-CL')}
                    </span>
                    <Link
                      href={`/dashboard/levantamientos/nuevo?visitaId=${lev.visita_id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver / Editar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm">
            No hay levantamientos registrados en el historial todavía.
          </div>
        )}
      </div>

    </div>
  );
}