'use client';

import { eliminarCliente } from '@/services/clientes.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteClienteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    
    setLoading(true);
    const res = await eliminarCliente(id);
    
    if (res && !res.success) {
      alert(res.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline font-medium text-sm disabled:opacity-50"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}