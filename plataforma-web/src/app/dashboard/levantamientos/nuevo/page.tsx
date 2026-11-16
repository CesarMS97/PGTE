'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Zap, 
  ShieldAlert,
  Building2,
  User,
  MapPin,
  ClipboardList,
  Plus,
  Trash2,
  ListChecks,
  GripVertical
} from 'lucide-react';
import { 
  autoguardarLevantamiento, 
  finalizarLevantamiento, 
  obtenerLevantamientoPorVisita 
} from '@/services/levantamientos.service';

// Convierte el string guardado en BD (JSON o texto con viñetas/saltos) a un arreglo limpio de hallazgos
function parsearHallazgos(raw?: string | null): string[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // Si es un texto antiguo separado por líneas o viñetas, lo convertimos en lista automáticamente
  }
  return raw
    .split('\n')
    .map((linea) => linea.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

// Serializa la lista para guardarla en el mismo campo `observaciones` sin alterar la base de datos
function serializarHallazgos(lista: string[]): string {
  if (lista.length === 0) return '';
  return JSON.stringify(lista);
}

export default function NuevoLevantamientoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitaId = searchParams.get('visitaId');

  // Estados del formulario correspondientes al esquema Prisma
  const [tipoInstalacion, setTipoInstalacion] = useState('');
  const [tipoEmpalme, setTipoEmpalme] = useState('');
  const [tensionNominalV, setTensionNominalV] = useState('');
  const [potenciaContratadaKw, setPotenciaContratadaKw] = useState('');
  const [puestaTierra, setPuestaTierra] = useState<boolean>(true);
  const [resistenciaTierraOhm, setResistenciaTierraOhm] = useState('');

  // Lista interactiva de observaciones y hallazgos
  const [hallazgos, setHallazgos] = useState<string[]>([]);
  const [nuevoHallazgo, setNuevoHallazgo] = useState('');

  // Estados para Drag and Drop HTML5 nativo
  const [indiceArrastrado, setIndiceArrastrado] = useState<number | null>(null);

  // Contexto de la visita (Inmueble, Cliente y Proyecto)
  const [contextoVisita, setContextoVisita] = useState<any>(null);
  const [cargandoContexto, setCargandoContexto] = useState<boolean>(true);

  // Control de estado visual para autoguardado
  const [estadoGuardado, setEstadoGuardado] = useState<'guardado' | 'guardando' | 'cambios_pendientes'>('guardado');
  const [ultimoGuardado, setUltimoGuardado] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const estaCargandoInicial = useRef(true);

  // Cargar datos del borrador previo y del contexto de la visita
  useEffect(() => {
    if (!visitaId) {
      setCargandoContexto(false);
      return;
    }

    async function cargarDatos() {
      const res: any = await obtenerLevantamientoPorVisita(visitaId!);
      if (res.success) {
        if (res.visita) {
          setContextoVisita(res.visita);
        }
        if (res.data) {
          setTipoInstalacion(res.data.tipo_instalacion || '');
          setTipoEmpalme(res.data.tipo_empalme || '');
          setTensionNominalV(res.data.tension_nominal_v ? res.data.tension_nominal_v.toString() : '');
          setPotenciaContratadaKw(res.data.potencia_contratada_kw ? res.data.potencia_contratada_kw.toString() : '');
          setPuestaTierra(res.data.puesta_tierra ?? true);
          setResistenciaTierraOhm(res.data.resistencia_tierra_ohm ? res.data.resistencia_tierra_ohm.toString() : '');
          setHallazgos(parsearHallazgos(res.data.observaciones));
        }
      }
      setCargandoContexto(false);
      estaCargandoInicial.current = false;
    }

    cargarDatos();
  }, [visitaId]);

  // Autoguardado con Debounce (Llamada al servicio en segundo plano)
  useEffect(() => {
    if (!visitaId || estaCargandoInicial.current) return;

    setEstadoGuardado('cambios_pendientes');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setEstadoGuardado('guardando');

      const res = await autoguardarLevantamiento({
        visitaId,
        tipoInstalacion,
        tipoEmpalme,
        tensionNominalV,
        potenciaContratadaKw,
        puestaTierra,
        resistenciaTierraOhm,
        observaciones: serializarHallazgos(hallazgos),
      });

      if (res.success) {
        setEstadoGuardado('guardado');
        setUltimoGuardado(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setEstadoGuardado('cambios_pendientes');
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visitaId, tipoInstalacion, tipoEmpalme, tensionNominalV, potenciaContratadaKw, puestaTierra, resistenciaTierraOhm, hallazgos]);

  // Agregar un nuevo ítem a la lista de hallazgos
  const handleAgregarHallazgo = () => {
    const texto = nuevoHallazgo.trim();
    if (!texto) return;

    setHallazgos((prev) => [...prev, texto]);
    setNuevoHallazgo('');
  };

  // Permitir agregar presionando Enter sin enviar el formulario completo
  const handleKeyDownHallazgo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAgregarHallazgo();
    }
  };

  // Funciones de Arrastrar y Soltar (Drag and Drop)
  const handleDragStart = (index: number) => {
    setIndiceArrastrado(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (indiceArrastrado === null || indiceArrastrado === index) return;

    setHallazgos((prev) => {
      const copia = [...prev];
      const [itemMovido] = copia.splice(indiceArrastrado, 1);
      copia.splice(index, 0, itemMovido);
      return copia;
    });
    setIndiceArrastrado(index);
  };

  const handleDragEnd = () => {
    setIndiceArrastrado(null);
  };

  // Eliminar un ítem de la lista
  const handleEliminarHallazgo = (index: number) => {
    setHallazgos((prev) => prev.filter((_, i) => i !== index));
  };

  // Manejador del botón final
  const handleGuardarDefinitivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitaId) {
      alert('Debes tener una visita técnica asociada para guardar el levantamiento.');
      return;
    }

    const listaFinal = nuevoHallazgo.trim()
      ? [...hallazgos, nuevoHallazgo.trim()]
      : hallazgos;

    const res = await finalizarLevantamiento({
      visitaId,
      tipoInstalacion,
      tipoEmpalme,
      tensionNominalV,
      potenciaContratadaKw,
      puestaTierra,
      resistenciaTierraOhm,
      observaciones: serializarHallazgos(listaFinal),
    });

    if (res.success) {
      router.push('/dashboard/levantamientos');
    } else {
      alert('Ocurrió un error al guardar el levantamiento.');
    }
  };

  const inmueble = contextoVisita?.proyectos?.inmuebles;
  const cliente = inmueble?.clientes;
  const nombreInmueble = inmueble?.nombre_referencia || inmueble?.direccion || 'Propiedad sin nombre';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Encabezado y barra de autoguardado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/levantamientos"
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Formulario de Levantamiento Técnico</h1>
              {visitaId && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Visita activa
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Registra los parámetros reales medidos en terreno.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          {estadoGuardado === 'guardando' && (
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Guardando borrador...
            </span>
          )}
          {estadoGuardado === 'cambios_pendientes' && (
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Cambios sin guardar
            </span>
          )}
          {estadoGuardado === 'guardado' && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Borrador guardado {ultimoGuardado && `(${ultimoGuardado})`}
            </span>
          )}
        </div>
      </div>

      {/* Tarjeta de Contexto: Cliente, Inmueble y Motivo de Visita */}
      {visitaId && (
        <div className="bg-gradient-to-r from-slate-900 to-[#0D2345] text-white p-5 rounded-xl shadow-sm border border-slate-800">
          {cargandoContexto ? (
            <div className="text-xs text-slate-300 animate-pulse py-2">
              Cargando datos del cliente e inmueble...
            </div>
          ) : contextoVisita ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>{contextoVisita.motivo || contextoVisita.proyectos?.titulo || 'Inspección Técnica'}</span>
                </div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400 shrink-0" />
                  {nombreInmueble}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 pl-7">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {inmueble?.direccion}{inmueble?.comuna ? `, ${inmueble.comuna}` : ''}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-blue-600/50 border border-blue-400/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {cliente?.nombre ? cliente.nombre.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-200 block">
                    Cliente / Propietario
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {cliente?.nombre || 'Cliente no asignado'}
                  </span>
                  {cliente?.telefono && (
                    <span className="text-xs text-slate-300 block">Tel: {cliente.telefono}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-amber-300">
              No se encontró información asociada a esta visita técnica.
            </div>
          )}
        </div>
      )}

      {/* Formulario de captura */}
      <form onSubmit={handleGuardarDefinitivo} className="space-y-6">
        
        {/* Sección: Parámetros del Empalme y Red */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Parámetros Eléctricos Generales</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipo de Instalación</label>
              <input
                type="text"
                value={tipoInstalacion}
                onChange={(e) => setTipoInstalacion(e.target.value)}
                placeholder="Ej: Domiciliaria, Comercial, Industrial..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipo de Empalme</label>
              <select
                value={tipoEmpalme}
                onChange={(e) => setTipoEmpalme(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Seleccione tipo de empalme...</option>
                <option value="Monofásico">Monofásico</option>
                <option value="Trifásico">Trifásico</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tensión Nominal (V)</label>
              <input
                type="number"
                step="0.01"
                value={tensionNominalV}
                onChange={(e) => setTensionNominalV(e.target.value)}
                placeholder="Ej: 220 o 380"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Potencia Contratada (kW)</label>
              <input
                type="number"
                step="0.01"
                value={potenciaContratadaKw}
                onChange={(e) => setPotenciaContratadaKw(e.target.value)}
                placeholder="Ej: 15.5"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resistencia Puesta a Tierra (Ω)</label>
              <input
                type="number"
                step="0.001"
                value={resistenciaTierraOhm}
                onChange={(e) => setResistenciaTierraOhm(e.target.value)}
                placeholder="Ej: 5.2"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">¿Cuenta con Puesta a Tierra?</label>
              <select
                value={puestaTierra ? 'true' : 'false'}
                onChange={(e) => setPuestaTierra(e.target.value === 'true')}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="true">Sí (Operativa)</option>
                <option value="false">No / Deficiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección: Lista Interactiva con Drag and Drop de Observaciones y Hallazgos */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Observaciones Técnicas y Hallazgos</h2>
                <p className="text-xs text-slate-500">Agrega y arrastra los ítems para reordenarlos según la prioridad para la cotización.</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
              {hallazgos.length} {hallazgos.length === 1 ? 'ítem' : 'ítems'}
            </span>
          </div>

          {/* Input para agregar nuevo hallazgo */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={nuevoHallazgo}
              onChange={(e) => setNuevoHallazgo(e.target.value)}
              onKeyDown={handleKeyDownHallazgo}
              placeholder="Ej: Tablero general sin protector diferencial, requiere cambio de automáticos..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={handleAgregarHallazgo}
              disabled={!nuevoHallazgo.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Agregar a la lista
            </button>
          </div>

          {/* Listado con Arrastrar y Soltar (Drag and Drop) */}
          {hallazgos.length === 0 ? (
            <div className="py-8 px-4 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl">
              <ListChecks className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-600">Aún no has agregado hallazgos u observaciones.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Escribe un punto arriba y presiona Enter o &quot;Agregar a la lista&quot;.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {hallazgos.map((item, idx) => (
                <li
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 border rounded-lg transition-all cursor-grab active:cursor-grabbing ${
                    indiceArrastrado === idx ? 'opacity-40 border-dashed border-blue-400 bg-blue-50/50' : 'border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm text-slate-800 flex-1 min-w-0">
                    <div className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing shrink-0 touch-none">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed truncate">{item}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEliminarHallazgo(idx)}
                    title="Eliminar hallazgo"
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/dashboard/levantamientos"
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Guardar y Salir
          </Link>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar y Finalizar Levantamiento
          </button>
        </div>

      </form>

    </div>
  );
}