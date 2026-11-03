import { getClientesSelect } from '@/services/clientes.service';
import { InmuebleForm } from '@/components/inmuebles/InmuebleForm';
import { connection } from 'next/server';

// Configuración requerida en Next.js 16 para rutas dinámicas con llamadas a servidor
export const instant = false;

export default async function NuevaInmueblePage() {
  await connection();
  const clientes = await getClientesSelect();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registrar Nuevo Inmueble</h2>
          <p className="text-muted-foreground text-sm">
            Completa los datos para ingresar una nueva propiedad asociada a un cliente.
          </p>
        </div>

        <InmuebleForm clientes={clientes} />
      </div>
    </div>
  );
}