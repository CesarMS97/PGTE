import Link from 'next/link';
import { connection } from 'next/server';
import { getProyectos } from '@/services/proyectos.service';
import { ProyectosTable } from '@/components/proyectos/ProyectosTable';
import { Plus, FolderKanban, AlertCircle } from 'lucide-react';

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
        <ProyectosTable proyectos={proyectos} />
      )}

    </div>
  );
}