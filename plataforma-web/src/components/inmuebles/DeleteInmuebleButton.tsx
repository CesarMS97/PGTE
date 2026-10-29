'use client';

import { deleteInmueble } from '@/services/inmuebles.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteInmuebleButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este inmueble?')) return;
    
    setLoading(true);
    const res = await deleteInmueble(id);
    
    if (res && !res.success) {
      alert(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard/inmuebles');
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}