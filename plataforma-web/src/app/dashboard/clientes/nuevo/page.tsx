import Link from 'next/link';
import { ClienteForm } from '@/components/clientes/ClientForm';

export default function NuevoClientePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link 
          href="/dashboard/clientes" 
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Volver a Clientes
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Registrar Nuevo Cliente
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Ingresa la información del cliente para vincularlo a la empresa.
        </p>
      </div>

      <ClienteForm isEditing={false} />
    </div>
  );
}