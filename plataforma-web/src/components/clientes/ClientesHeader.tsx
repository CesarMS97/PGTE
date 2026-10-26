import ClientModalButton from "@/components/clientes/ClientModalButton";

interface ClientesHeaderProps {
  empresaNombre: string;
  empresaId: string;
}

export default function ClientesHeader({ empresaNombre, empresaId }: ClientesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Módulo de Clientes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Empresa activa: <span className="font-semibold text-gray-700">{empresaNombre}</span>
        </p>
      </div>

      <ClientModalButton empresaId={empresaId} />
    </div>
  );
}