'use client';

import { eliminarCliente } from '@/services/clientes.service';
import { useState, useTransition } from 'react';

export function DeleteClienteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    
    startTransition(async () => {
      const res = await eliminarCliente(id);
      // Si hubo un error controlado (ej: tiene inmuebles asociados), lo mostramos
      if (res && !res.success) {
        alert(res.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:underline font-medium text-sm disabled:opacity-50"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}