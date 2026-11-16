// Filtro de pertenencia sobre la tabla clientes (empresa o técnico independiente).
// Un solo lugar para que todos los servicios apliquen la misma regla.
export type ContextoTenant = {
  empresaId: string | null;
  perfilId: string;
};

export function filtroClientes(ctx: ContextoTenant) {
  return ctx.empresaId
    ? { empresa_id: ctx.empresaId }
    : { tecnico_id: ctx.perfilId };
}