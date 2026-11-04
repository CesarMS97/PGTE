import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { getProyectoPorId } from '@/services/proyectos.service';
import { ProyectoDetalleTabs } from '@/components/proyectos/ProyectoDetalleTabs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const instant = false;

export const metadata = {
  title: 'Detalle de Proyecto | PGTE',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProyectoDetallePage({ params }: PageProps) {
  await connection();
  const { id } = await params;

  const proyectoRaw = await getProyectoPorId(id);

  if (!proyectoRaw) {
    notFound();
  }

  // Serializamos el objeto para transformar los Decimal de Prisma en tipos planos (números/strings)
  const proyecto = JSON.parse(JSON.stringify(proyectoRaw));

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/proyectos"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Proyectos
        </Link>
      </div>

      <ProyectoDetalleTabs proyecto={proyecto} />
    </div>
  );
}   