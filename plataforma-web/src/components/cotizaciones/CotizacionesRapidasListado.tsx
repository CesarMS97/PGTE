'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Plus,
  Trash2,
  Clock,
  UserPlus,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';

interface ItemRapido {
  id: string;
  tipo: 'material' | 'mano_obra' | 'otro';
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CotizacionRapidaGuardada {
  id: string;
  savedAt: number;
  folio: string;
  clienteNombre: string;
  clienteTelefono: string;
  proyectoTitulo: string;
  direccionReferencia: string;
  items: ItemRapido[];
}

export const STORAGE_LIST_KEY = 'pgte_cotizaciones_rapidas_lista_v1';
export const TTL_24_HORAS = 24 * 60 * 60 * 1000;

export function formatearCLPRapida(valor: number): string {
  return Math.round(valor).toLocaleString('es-CL');
}

export function calcularTotalRapida(items: ItemRapido[] = []): number {
  const subtotal = items.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
  const iva = Math.round(subtotal * 0.19);
  return Math.round(subtotal + iva);
}

export function formatearTiempoRestanteRapida(savedAt: number): string {
  const restanteMs = TTL_24_HORAS - (Date.now() - savedAt);
  if (restanteMs <= 0) return 'Expirada';
  const horas = Math.floor(restanteMs / (60 * 60 * 1000));
  const minutos = Math.floor((restanteMs % (60 * 60 * 1000)) / (60 * 1000));
  if (horas > 0) return `${horas}h ${minutos}m restantes`;
  return `${minutos}m restantes`;
}

interface CotizacionesRapidasListadoProps {
  cotizacionActivaId?: string;
  onSeleccionar?: (cot: CotizacionRapidaGuardada) => void;
  onNuevaRapida?: () => void;
  compacto?: boolean;
  ocultarBotonNueva?: boolean;
}

export function CotizacionesRapidasListado({
  cotizacionActivaId,
  onSeleccionar,
  onNuevaRapida,
  compacto = false,
  ocultarBotonNueva = false,
}: CotizacionesRapidasListadoProps) {
  const [lista, setLista] = useState<CotizacionRapidaGuardada[]>([]);

  useEffect(() => {
    const cargar = () => {
      try {
        const ahora = Date.now();
        const raw = window.localStorage.getItem(STORAGE_LIST_KEY);
        if (!raw) {
          setLista([]);
          return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          setLista([]);
          return;
        }
        const vigentes = parsed.filter(
          (c: CotizacionRapidaGuardada) => c && c.savedAt && ahora - c.savedAt <= TTL_24_HORAS
        );
        setLista(vigentes);
        window.localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(vigentes));
      } catch (err) {
        console.error('Error leyendo cotizaciones rápidas:', err);
      }
    };

    cargar();
    window.addEventListener('storage', cargar);
    return () => window.removeEventListener('storage', cargar);
  }, [cotizacionActivaId]);

  const handleEliminar = (id: string) => {
    if (!window.confirm('¿Eliminar esta cotización rápida?')) return;
    const actualizada = lista.filter((item) => item.id !== id);
    setLista(actualizada);
    try {
      window.localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(actualizada));
    } catch {
      // ignorar error de storage
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Cotizaciones Rápidas en Este Dispositivo ({lista.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Presupuestos express sin registro previo. Vigentes por 24 horas para revisar, reenviar o fidelizar al cliente.
          </p>
        </div>

        {!ocultarBotonNueva &&
          (onNuevaRapida ? (
            <button
              type="button"
              onClick={onNuevaRapida}
              className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Nueva Cotización Rápida
            </button>
          ) : (
            <Link
              href="/dashboard/cotizaciones/rapida?nueva=1"
              className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Nueva Cotización Rápida
            </Link>
          ))}
      </div>

      {lista.length > 0 ? (
        <div
          className={`grid grid-cols-1 ${
            compacto ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-3`}
        >
          {lista.map((cot) => {
            const totalConIva = calcularTotalRapida(cot.items);
            const esActiva = cotizacionActivaId && cot.id === cotizacionActivaId;

            return (
              <div
                key={cot.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  esActiva
                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/30'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {cot.folio}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> {formatearTiempoRestanteRapida(cot.savedAt)}
                    </span>
                  </div>

                  <p className="font-bold text-slate-900 text-sm mt-2 truncate">
                    {cot.clienteNombre?.trim() || 'Cliente / Prospecto sin nombre'}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {cot.proyectoTitulo?.trim() || `${cot.items?.length || 0} ítem(s) cotizados`}
                  </p>
                  <p className="text-base font-extrabold text-blue-600 mt-2">
                    ${formatearCLPRapida(totalConIva)}{' '}
                    <span className="text-[11px] font-normal text-slate-500">(IVA incl.)</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200/80 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {onSeleccionar ? (
                      <button
                        type="button"
                        onClick={() => onSeleccionar(cot)}
                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        {esActiva ? 'Abierta' : 'Abrir'}
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/cotizaciones/rapida?id=${encodeURIComponent(cot.id)}`}
                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Abrir / Editar
                      </Link>
                    )}

                    <Link
                      href="/dashboard/clientes/nuevo"
                      className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Fidelizar
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEliminar(cot.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar cotización rápida"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
          No hay cotizaciones rápidas activas en este momento. Crea una con el botón{' '}
          <strong className="text-slate-700">Nueva Cotización Rápida</strong>.
        </div>
      )}
    </div>
  );
}