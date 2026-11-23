import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import {
  Users,
  House,
  ClipboardList,
  FileText,
  UserPlus,
  HousePlus,
  ClipboardPlus,
  ArrowRight,
  Clock3,
  Zap,
} from "lucide-react";

export const instant = false;

export default async function DashboardPage() {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tecnicoIdFiltro: string | undefined = undefined;
  let empresaIdFiltro: string | undefined = undefined;

  if (user) {
    const perfil = await prisma.perfiles.findUnique({
      where: { id: user.id },
      select: { id: true, empresa_id: true },
    });
    if (perfil) {
      tecnicoIdFiltro = perfil.id;
      empresaIdFiltro = perfil.empresa_id || undefined;
    }
  }

  const hoyInicio = new Date();
  hoyInicio.setHours(0, 0, 0, 0);

  const hoyFin = new Date();
  hoyFin.setHours(23, 59, 59, 999);

  const filtroClientes = empresaIdFiltro
    ? { empresa_id: empresaIdFiltro }
    : tecnicoIdFiltro
    ? { tecnico_id: tecnicoIdFiltro }
    : {};

  const filtroInmuebles = empresaIdFiltro
    ? { clientes: { empresa_id: empresaIdFiltro } }
    : tecnicoIdFiltro
    ? { proyectos: { some: { tecnico_id: tecnicoIdFiltro } } }
    : {};

  const filtroProyectoTecnico = empresaIdFiltro
    ? { proyectos: { inmuebles: { clientes: { empresa_id: empresaIdFiltro } } } }
    : tecnicoIdFiltro
    ? { proyectos: { tecnico_id: tecnicoIdFiltro } }
    : {};

  const [
    clientesCount,
    inmueblesCount,
    levantamientosPendientesCount,
    cotizacionesCount,
    visitasPendientes,
    ultimasCotizaciones,
  ] = await Promise.all([
    prisma.clientes.count({
      where: {
        activo: true,
        ...filtroClientes,
      },
    }),

    prisma.inmuebles.count({
      where: {
        activo: true,
        ...filtroInmuebles,
      },
    }),

    prisma.visitas_tecnicas.count({
      where: {
        ...(tecnicoIdFiltro ? { tecnico_id: tecnicoIdFiltro } : {}),
        estado: { not: "completada" },
        fecha_programada: { lte: hoyFin },
      },
    }),

    prisma.cotizaciones.count({
      where: {
        ...filtroProyectoTecnico,
      },
    }),

    prisma.visitas_tecnicas.findMany({
      where: {
        ...(tecnicoIdFiltro ? { tecnico_id: tecnicoIdFiltro } : {}),
        estado: { not: "completada" },
        fecha_programada: { lte: hoyFin },
      },
      include: {
        proyectos: {
          include: {
            inmuebles: {
              include: {
                clientes: true,
              },
            },
          },
        },
      },
      orderBy: { fecha_programada: "asc" },
      take: 5,
    }),

    prisma.cotizaciones.findMany({
      where: {
        ...filtroProyectoTecnico,
      },
      include: {
        proyectos: {
          include: {
            inmuebles: {
              include: {
                clientes: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Clientes", value: clientesCount ?? 0, icon: Users, href: "/dashboard/clientes" },
    { label: "Viviendas", value: inmueblesCount ?? 0, icon: House, href: "/dashboard/inmuebles" },
    { label: "Levantamientos pendientes", value: levantamientosPendientesCount ?? 0, icon: ClipboardList, href: "/dashboard/levantamientos" },
    { label: "Cotizaciones", value: cotizacionesCount ?? 0, icon: FileText, href: "/dashboard/cotizaciones" },
  ];

  const actions = [
    { label: "Nuevo cliente", href: "/dashboard/clientes", icon: UserPlus },
    { label: "Nueva vivienda", href: "/dashboard/inmuebles", icon: HousePlus },
    { label: "Nuevo levantamiento", href: "/dashboard/levantamientos", icon: ClipboardPlus },
    { label: "Nueva cotización rápida", href: "/dashboard/cotizaciones/rapida?nueva=1", icon: Zap },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Mi panel de trabajo
          </h1>
          <p className="mt-2 text-slate-500">
            Gestiona tus clientes, viviendas y trabajos eléctricos.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md block"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <Icon className="h-5 w-5 text-blue-700" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {value}
              </p>
            </Link>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Acciones rápidas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Comienza una nueva gestión.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {actions.map(({ label, href, icon: Icon }) => {
              const esRapida = href.startsWith("/dashboard/cotizaciones/rapida");
              return (
                <Link
                  key={label}
                  href={href}
                  className={
                    esRapida
                      ? "flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50/70 p-4 transition hover:border-amber-400 hover:bg-amber-100/70"
                      : "flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                  }
                >
                  <Icon className={`h-6 w-6 ${esRapida ? "text-amber-600" : "text-blue-700"}`} />
                  <span className="flex-1 text-sm font-medium text-slate-800">
                    {label}
                  </span>
                  <ArrowRight className={`h-4 w-4 ${esRapida ? "text-amber-600" : "text-slate-400"}`} />
                </Link>
              );
            })}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Modo express • Sin registro
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1.5">
                ¿Necesitas cotizar en terreno sin crear cliente ni proyecto?
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Calcula con IVA (19%), descarga en PDF o envía por WhatsApp al instante y fideliza al cliente si acepta.
              </p>
            </div>
            <Link
              href="/dashboard/cotizaciones/rapida?nueva=1"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white transition-colors shrink-0 shadow-xs"
            >
              <Zap className="h-4 w-4" />
              Nueva Cotización Rápida
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-700" />
                  <h2 className="text-lg font-semibold">Visitas pendientes</h2>
                </div>
                <Link href="/dashboard/levantamientos" className="text-xs font-bold text-blue-600 hover:underline">
                  Ver todas →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {visitasPendientes && visitasPendientes.length > 0 ? (
                  visitasPendientes.map((lev: any) => (
                    <div key={lev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {lev.proyectos?.titulo || "Visita Técnica"}
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          {lev.proyectos?.inmuebles?.clientes?.nombre || "Cliente N/A"} — {lev.proyectos?.inmuebles?.comuna || "Sin comuna"}
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/levantamientos`}
                        className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        Gestionar
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-slate-50 p-6 text-center">
                    <Clock3 className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-500">
                      No hay visitas pendientes registradas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-700" />
                  <h2 className="text-lg font-semibold">Cotizaciones recientes</h2>
                </div>
                <Link href="/dashboard/cotizaciones" className="text-xs font-bold text-blue-600 hover:underline">
                  Ver todas →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {ultimasCotizaciones && ultimasCotizaciones.length > 0 ? (
                  ultimasCotizaciones.map((cot: any) => (
                    <div key={cot.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-blue-600 text-sm">
                          {cot.numero} — ${Number(cot.total || 0).toLocaleString("es-CL")}
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          {cot.proyectos?.inmuebles?.clientes?.nombre || "Cliente N/A"}
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/cotizaciones/nueva?proyectoId=${cot.proyecto_id}`}
                        className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        Ver / Editar
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-slate-50 p-6 text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-500">
                      Aquí aparecerán tus últimas cotizaciones.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}