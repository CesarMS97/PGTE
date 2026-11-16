import { connection } from 'next/server';
import { getInmueblesParaProyecto } from '@/services/inmuebles.service';
import { createProyecto } from '@/services/proyectos.service';
import { ProyectoForm } from '@/components/proyectos/ProyectoForm';
import Link from 'next/link';
import { ArrowLeft, FolderPlus } from 'lucide-react';

export const instant = false;

export const metadata = {
  title: 'Nuevo Proyecto | PGTE',
  description: 'Crear una nueva orden de trabajo o proyecto técnico',
};

export default async function NuevoProyectoPage() {
  await connection();

  // Solo las columnas que usa el formulario, en una sola consulta con JOIN
  const inmuebles = await getInmueblesParaProyecto();

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/proyectos"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Proyectos
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Registrar Nuevo Proyecto</h1>
            <p className="text-sm text-slate-500">Crea una orden de trabajo asociada a un cliente y su inmueble.</p>
          </div>
        </div>

        <ProyectoForm inmuebles={inmuebles} action={createProyecto} />
      </div>
    </div>
  );
}