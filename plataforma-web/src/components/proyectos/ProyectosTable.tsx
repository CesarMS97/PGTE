"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PrioridadBadge, EstadoBadge } from "@/components/proyectos/ProyectoBadges";
import { Building2, User, Calendar, Search, X } from "lucide-react";

interface ProyectoItem {
  id: string;
  titulo: string;
  tipo_trabajo?: string | null;
  prioridad: string;
  estado: string;
  fecha_solicitud?: Date | string | null;
  inmuebles?: {
    nombre_referencia?: string | null;
    direccion?: string | null;
    clientes?: {
      nombre?: string | null;
    } | null;
  } | null;
}

export function ProyectosTable({ proyectos }: { proyectos: ProyectoItem[] }) {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroInmueble, setFiltroInmueble] = useState("");

  // Filtrado combinado por cliente e inmueble en tiempo real
  const proyectosFiltrados = useMemo(() => {
    const termCliente = filtroCliente.trim().toLowerCase();
    const termInmueble = filtroInmueble.trim().toLowerCase();

    return proyectos.filter((proyecto) => {
      const nombreCliente = (proyecto.inmuebles?.clientes?.nombre ?? "").toLowerCase();
      const nombreInmueble = (
        proyecto.inmuebles?.nombre_referencia ||
        proyecto.inmuebles?.direccion ||
        ""
      ).toLowerCase();
      const direccionInmueble = (proyecto.inmuebles?.direccion ?? "").toLowerCase();

      const coincideCliente = !termCliente || nombreCliente.includes(termCliente);
      const coincideInmueble =
        !termInmueble ||
        nombreInmueble.includes(termInmueble) ||
        direccionInmueble.includes(termInmueble);

      return coincideCliente && coincideInmueble;
    });
  }, [proyectos, filtroCliente, filtroInmueble]);

  const hayFiltrosActivos = filtroCliente.trim() !== "" || filtroInmueble.trim() !== "";

  const limpiarFiltros = () => {
    setFiltroCliente("");
    setFiltroInmueble("");
  };

  return (
    <div className="space-y-4">
      {/* Barra de filtros combinados */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Filtro por Cliente */}
          <div className="relative flex-1 max-w-sm">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              placeholder="Filtrar por cliente..."
              className="w-full pl-10 pr-8 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {filtroCliente && (
              <button
                type="button"
                onClick={() => setFiltroCliente("")}
                title="Limpiar filtro de cliente"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Inmueble */}
          <div className="relative flex-1 max-w-sm">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filtroInmueble}
              onChange={(e) => setFiltroInmueble(e.target.value)}
              placeholder="Filtrar por inmueble o dirección..."
              className="w-full pl-10 pr-8 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {filtroInmueble && (
              <button
                type="button"
                onClick={() => setFiltroInmueble("")}
                title="Limpiar filtro de inmueble"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1.5 transition-colors self-start sm:self-center"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500 whitespace-nowrap">
          Mostrando{" "}
          <span className="font-semibold text-slate-700">
            {proyectosFiltrados.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-slate-700">
            {proyectos.length}
          </span>{" "}
          proyectos
        </p>
      </div>

      {/* Tabla de Proyectos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Título / Trabajo</th>
                <th className="py-3.5 px-6">Inmueble / Cliente</th>
                <th className="py-3.5 px-6">Prioridad</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6">Fecha Solicitud</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {proyectosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-6 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Search className="w-5 h-5 text-slate-400 mb-1" />
                      <p>No se encontraron proyectos que coincidan con los filtros aplicados.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                proyectosFiltrados.map((proyecto) => {
                  const cliente = proyecto.inmuebles?.clientes;
                  const fechaFormateada = proyecto.fecha_solicitud
                    ? new Date(proyecto.fecha_solicitud).toISOString().split("T")[0]
                    : "N/A";

                  return (
                    <tr
                      key={proyecto.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">
                          {proyecto.titulo}
                        </div>
                        <div className="text-xs text-slate-500">
                          {proyecto.tipo_trabajo || "Sin tipo especificado"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          {proyecto.inmuebles?.nombre_referencia ||
                            proyecto.inmuebles?.direccion ||
                            "Inmueble sin nombre"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {cliente?.nombre || "Cliente no asignado"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <PrioridadBadge prioridad={proyecto.prioridad} />
                      </td>
                      <td className="py-4 px-6">
                        <EstadoBadge estado={proyecto.estado} />
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {fechaFormateada}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Link
                          href={`/dashboard/proyectos/${proyecto.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}