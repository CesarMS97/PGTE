import { getInmueblePorId } from '@/services/inmuebles.service';
import { getClientesSelect } from '@/services/clientes.service';
import { InmuebleForm } from '@/components/inmuebles/InmuebleForm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarInmueblePage({ params }: PageProps) {
  const { id } = await params;
  const [inmueble, clientes] = await Promise.all([
    getInmueblePorId(id),
    getClientesSelect(),
  ]);

  if (!inmueble) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Editar Inmueble</h2>
        <p className="text-muted-foreground text-sm">
          Modifica los datos de la propiedad registrada.
        </p>
      </div>

      <InmuebleForm clientes={clientes} inmueble={inmueble} />
    </div>
  );
}