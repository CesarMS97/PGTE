"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface InmuebleConCliente {
  id: string;
  nombre_referencia?: string | null;
  direccion: string;
  comuna: string;
  tipo_uso: string | null;
  clientes?: {
    nombre: string;
  } | null;
}

export function InmueblesTable({ inmuebles }: { inmuebles: InmuebleConCliente[] }) {
  const [busquedaCliente, setBusquedaCliente] = useState("");

  // Filtra los inmuebles por el nombre del cliente en tiempo real
  const inmueblesFiltrados = useMemo(() => {
    const termino = busquedaCliente.trim().toLowerCase();
    if (!termino) return inmuebles;

    return inmuebles.filter((inmueble) =>
      (inmueble.clientes?.nombre ?? "").toLowerCase().includes(termino)
    );
  }, [inmuebles, busquedaCliente]);

  return (
    <div className="space-y-4">
      {/* Barra de filtro por cliente */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            placeholder="Buscar inmueble por nombre de cliente..."
            className="w-full pl-10 pr-9 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {busquedaCliente && (
            <button
              type="button"
              onClick={() => setBusquedaCliente("")}
              title="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Mostrando{" "}
          <span className="font-semibold text-slate-700">
            {inmueblesFiltrados.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-slate-700">
            {inmuebles.length}
          </span>{" "}
          inmuebles
        </p>
      </div>

      {/* Tabla de inmuebles */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Inmueble</th>
                <th className="py-3.5 px-6">Cliente / Propietario</th>
                <th className="py-3.5 px-6">Dirección</th>
                <th className="py-3.5 px-6">Comuna</th>
                <th className="py-3.5 px-6">Tipo de Uso</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {inmueblesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-6 text-center text-slate-500">
                    No se encontraron inmuebles asociados al cliente{" "}
                    <span className="font-medium text-slate-700">
                      "{busquedaCliente}"
                    </span>
                    .
                  </td>
                </tr>
              ) : (
                inmueblesFiltrados.map((inmueble) => (
                  <tr
                    key={inmueble.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {inmueble.nombre_referencia || (
                        <span className="text-slate-400 italic font-normal">
                          Sin nombre
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {inmueble.clientes ? (
                        inmueble.clientes.nombre
                      ) : (
                        <span className="text-slate-400 italic">
                          Sin asignar
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {inmueble.direccion}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {inmueble.comuna}
                    </td>
                    <td className="py-4 px-6">
                      {inmueble.tipo_uso ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {inmueble.tipo_uso}
                        </span>
                      ) : (
                        <span className="text-slate-400">N/D</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link
                        href={`/dashboard/inmuebles/${inmueble.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/inmuebles/${inmueble.id}/editar`}
                        className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}