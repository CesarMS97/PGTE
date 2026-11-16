import { connection } from 'next/server';
import { getInmueblePorId } from '@/services/inmuebles.service';
import { getClientesSelect } from '@/services/clientes.service';
import { InmuebleForm } from '@/components/inmuebles/InmuebleForm';
import { notFound } from 'next/navigation';

// Configuración requerida en Next.js 16 para rutas dinámicas
export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarInmueblePage({ params }: PageProps) {
  await connection();
  const { id } = await params;
  
  const [inmuebleRaw, clientes] = await Promise.all([
    getInmueblePorId(id),
    getClientesSelect(),
  ]);

  if (!inmuebleRaw) {
    notFound();
  }

  // Serializamos el Decimal de Prisma para que sea compatible con el Client Component
  const inmueble = {
    ...inmuebleRaw,
    superficie_m2: inmuebleRaw.superficie_m2 ? Number(inmuebleRaw.superficie_m2) : null,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Inmueble</h2>
          <p className="text-muted-foreground text-sm">
            Modifica los datos de la propiedad registrada.
          </p>
        </div>

        <InmuebleForm clientes={clientes} inmueble={inmueble} />
      </div>
    </div>
  );
}