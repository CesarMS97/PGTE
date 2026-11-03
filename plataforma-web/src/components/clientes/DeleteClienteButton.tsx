'use client';

import { eliminarCliente } from '@/services/clientes.service';
import { useTransition } from 'react';

export function DeleteClienteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    
    startTransition(async () => {
      const res = await eliminarCliente(id);
      
      // Si hubo un error controlado (ej: tiene inmuebles asociados), lo mostramos
      if (res && !res.success) {
        alert(res.error);
        return;
      }

      // Forzamos una navegación limpia hacia el listado para evitar el 404 de la ficha borrada
      window.location.href = '/dashboard/clientes';
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}