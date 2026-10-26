import { getClientesSelect } from '@/services/clientes.service';
import { InmuebleForm } from '@/components/inmuebles/InmuebleForm';

export default async function NuevaInmueblePage() {
  const clientes = await getClientesSelect();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Registrar Nuevo Inmueble</h2>
        <p className="text-muted-foreground text-sm">
          Completa los datos para ingresar una nueva propiedad asociada a un cliente.
        </p>
      </div>

      <InmuebleForm clientes={clientes} />
    </div>
  );
}