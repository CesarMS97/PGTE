import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DeleteInmuebleButton } from '@/components/inmuebles/DeleteInmuebleButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleInmueblePage({ params }: PageProps) {
  const { id } = await params;

  const inmueble = await prisma.inmuebles.findUnique({
    where: { id },
    include: {
      clientes: true,
      proyectos: true,
    },
  });

  if (!inmueble) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header con botón para volver y acciones de gestión */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {inmueble.nombre_referencia || inmueble.direccion}
          </h2>
          <p className="text-sm text-muted-foreground">
            Detalle general de la propiedad registrada
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/inmuebles/${inmueble.id}/editar`}
            className="px-4 py-2 border bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Editar Inmueble
          </Link>
          <DeleteInmuebleButton id={inmueble.id} />
          <Link
            href="/dashboard/inmuebles"
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ← Volver
          </Link>
        </div>
      </div>

      {/* Tarjeta con los datos de la base de datos */}
      <div className="bg-white border rounded-lg p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Dirección</span>
            <p className="text-sm font-medium mt-1">{inmueble.direccion}</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Comuna / Región</span>
            <p className="text-sm font-medium mt-1">
              {inmueble.comuna} {inmueble.region ? `, ${inmueble.region}` : ''}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Cliente Propietario</span>
            <p className="text-sm font-medium mt-1 text-primary">
              {inmueble.clientes?.nombre || 'Sin cliente asignado'}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Tipo de Uso</span>
            <p className="text-sm font-medium mt-1">{inmueble.tipo_uso || 'No especificado'}</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Superficie</span>
            <p className="text-sm font-medium mt-1">
              {inmueble.superficie_m2 ? `${inmueble.superficie_m2} m²` : 'Sin registro'}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Antigüedad</span>
            <p className="text-sm font-medium mt-1">
              {inmueble.antiguedad_anios ? `${inmueble.antiguedad_anios} años` : 'Sin registro'}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Material de Construcción</span>
            <p className="text-sm font-medium mt-1">{inmueble.material_construccion || 'No especificado'}</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Estado</span>
            <span className="inline-flex items-center mt-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {inmueble.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {inmueble.observaciones && (
          <div className="pt-4 border-t">
            <span className="text-xs font-semibold uppercase text-muted-foreground block">Observaciones</span>
            <p className="text-sm mt-1 text-gray-700">{inmueble.observaciones}</p>
          </div>
        )}
      </div>
    </div>
  );
}