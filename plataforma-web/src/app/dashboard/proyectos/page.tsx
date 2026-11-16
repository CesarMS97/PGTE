import Link from 'next/link';
import { connection } from 'next/server';
import { getProyectos } from '@/services/proyectos.service';
import { PrioridadBadge, EstadoBadge } from '@/components/proyectos/ProyectoBadges';
import { Plus, FolderKanban, Building2, User, Calendar, AlertCircle } from 'lucide-react';

// Desactiva el prerenderizado instantáneo de Next.js 16 para rutas dinámicas con connection()
export const instant = false;

export const metadata = {
  title: 'Proyectos | PGTE',
  description: 'Gestión de proyectos y flujos técnicos',
};

export default async function ProyectosPage() {
  // Garantiza evaluación dinámica en request-time en Next.js 16
  await connection();

  const proyectos = await getProyectos();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Encabezado de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-indigo-600" />
            Gestión de Proyectos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las órdenes de trabajo, visitas técnicas y levantamientos de tus clientes e inmuebles.
          </p>
        </div>
        
        <Link
          href="/dashboard/proyectos/nuevo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Listado o Estado Vacío */}
      {proyectos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No hay proyectos registrados</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Comienza registrando tu primer proyecto asociado a un inmueble para habilitar las visitas y levantamientos técnicos.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/proyectos/nuevo"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear primer proyecto
            </Link>
          </div>
        </div>
      ) : (
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
                {proyectos.map((proyecto: any) => {
                  const cliente = proyecto.inmuebles?.clientes;
                  const fechaFormateada = proyecto.fecha_solicitud 
                    ? new Date(proyecto.fecha_solicitud).toISOString().split('T')[0] 
                    : 'N/A';

                  return (
                    <tr key={proyecto.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{proyecto.titulo}</div>
                        <div className="text-xs text-slate-500">{proyecto.tipo_trabajo || 'Sin tipo especificado'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          {proyecto.inmuebles?.nombre_referencia || proyecto.inmuebles?.direccion || 'Inmueble sin nombre'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {cliente?.nombre || 'Cliente no asignado'}
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}