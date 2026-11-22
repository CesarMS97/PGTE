'use client';

import { useState, useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { CotizacionesView } from '@/components/cotizaciones/CotizacionesView';

interface CotizacionesFiltrosWrapperProps {
  cotizaciones: any[];
  levantamientos: any[];
}

export function CotizacionesFiltrosWrapper({
  cotizaciones,
  levantamientos,
}: CotizacionesFiltrosWrapperProps) {
  const [busqueda, setBusqueda] = useState('');
  const [clienteFiltro, setClienteFiltro] = useState('');
  const [inmuebleFiltro, setInmuebleFiltro] = useState('');
  const [proyectoFiltro, setProyectoFiltro] = useState('');

  const { clientesUnicos, inmueblesUnicos, proyectosUnicos } = useMemo(() => {
    const clientesSet = new Set<string>();
    const inmueblesSet = new Set<string>();
    const proyectosSet = new Set<string>();

    for (const cot of cotizaciones || []) {
      const cliente =
        cot?.proyectos?.inmuebles?.clientes?.nombre ||
        cot?.cliente_nombre ||
        cot?.cliente ||
        '';
      const inmueble =
        cot?.proyectos?.inmuebles?.nombre_referencia ||
        cot?.proyectos?.inmuebles?.direccion ||
        cot?.inmueble_nombre ||
        '';
      const proyecto = cot?.proyectos?.titulo || cot?.proyecto_titulo || '';

      if (cliente.trim()) clientesSet.add(cliente.trim());
      if (inmueble.trim()) inmueblesSet.add(inmueble.trim());
      if (proyecto.trim()) proyectosSet.add(proyecto.trim());
    }

    return {
      clientesUnicos: Array.from(clientesSet).sort((a, b) => a.localeCompare(b, 'es')),
      inmueblesUnicos: Array.from(inmueblesSet).sort((a, b) => a.localeCompare(b, 'es')),
      proyectosUnicos: Array.from(proyectosSet).sort((a, b) => a.localeCompare(b, 'es')),
    };
  }, [cotizaciones]);

  const cotizacionesFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return (cotizaciones || []).filter((cot) => {
      const cliente = (
        cot?.proyectos?.inmuebles?.clientes?.nombre ||
        cot?.cliente_nombre ||
        cot?.cliente ||
        ''
      ).trim();

      const inmueble = (
        cot?.proyectos?.inmuebles?.nombre_referencia ||
        cot?.proyectos?.inmuebles?.direccion ||
        cot?.inmueble_nombre ||
        ''
      ).trim();

      const proyecto = (cot?.proyectos?.titulo || cot?.proyecto_titulo || '').trim();
      const numero = (cot?.numero || '').toString().toLowerCase();

      if (clienteFiltro && cliente !== clienteFiltro) return false;
      if (inmuebleFiltro && inmueble !== inmuebleFiltro) return false;
      if (proyectoFiltro && proyecto !== proyectoFiltro) return false;

      if (q) {
        const coincideTexto =
          numero.includes(q) ||
          cliente.toLowerCase().includes(q) ||
          inmueble.toLowerCase().includes(q) ||
          proyecto.toLowerCase().includes(q);
        if (!coincideTexto) return false;
      }

      return true;
    });
  }, [cotizaciones, busqueda, clienteFiltro, inmuebleFiltro, proyectoFiltro]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setClienteFiltro('');
    setInmuebleFiltro('');
    setProyectoFiltro('');
  };

  const hayFiltrosActivos =
    Boolean(busqueda.trim()) ||
    Boolean(clienteFiltro) ||
    Boolean(inmuebleFiltro) ||
    Boolean(proyectoFiltro);

  return (
    <CotizacionesView
      cotizaciones={cotizacionesFiltradas}
      levantamientos={levantamientos}
      filtrosCard={
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              Buscar Cotizaciones
            </h2>
            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Folio o texto</label>
              <input
                type="text"
                placeholder="Ej: COT-4015 o tablero"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Cliente</label>
              <select
                value={clienteFiltro}
                onChange={(e) => setClienteFiltro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              >
                <option value="">Todos los clientes</option>
                {clientesUnicos.map((cli) => (
                  <option key={cli} value={cli}>
                    {cli}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Inmueble</label>
              <select
                value={inmuebleFiltro}
                onChange={(e) => setInmuebleFiltro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              >
                <option value="">Todos los inmuebles</option>
                {inmueblesUnicos.map((inm) => (
                  <option key={inm} value={inm}>
                    {inm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Proyecto</label>
              <select
                value={proyectoFiltro}
                onChange={(e) => setProyectoFiltro(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              >
                <option value="">Todos los proyectos</option>
                {proyectosUnicos.map((proy) => (
                  <option key={proy} value={proy}>
                    {proy}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
    />
  );
}