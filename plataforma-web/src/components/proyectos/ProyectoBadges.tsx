export function PrioridadBadge({ prioridad }: { prioridad: string }) {
  const styles: Record<string, string> = {
    alta: 'bg-red-50 text-red-700 border-red-200',
    normal: 'bg-blue-50 text-blue-700 border-blue-200',
    baja: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[prioridad] || styles.normal}`}>
      {prioridad.toUpperCase()}
    </span>
  );
}

export function EstadoBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    solicitado: 'bg-amber-50 text-amber-700 border-amber-200',
    en_proceso: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    finalizado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelado: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[estado] || styles.solicitado}`}>
      {estado.replace('_', ' ').toUpperCase()}
    </span>
  );
}