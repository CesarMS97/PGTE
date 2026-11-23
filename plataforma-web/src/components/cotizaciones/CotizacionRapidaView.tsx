'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Loader2,
  Download,
  MessageSquare,
  User,
  ArrowLeft,
  UserPlus,
  Sparkles,
  Save,
} from 'lucide-react';
import {
  CotizacionesRapidasListado,
  CotizacionRapidaGuardada,
  STORAGE_LIST_KEY,
  TTL_24_HORAS,
} from '@/components/cotizaciones/CotizacionesRapidasListado';

interface ItemRapido {
  id: string;
  tipo: 'material' | 'mano_obra' | 'otro';
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

const STORAGE_LEGACY_KEY = 'pgte_cotizacion_rapida_24h_v1';

function formatearCLP(valor: number): string {
  return Math.round(valor).toLocaleString('es-CL');
}

function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generarFolioRapido(): string {
  const ahora = new Date();
  const y = ahora.getFullYear().toString().slice(-2);
  const m = String(ahora.getMonth() + 1).padStart(2, '0');
  const d = String(ahora.getDate()).padStart(2, '0');
  const rand = Math.floor(100 + Math.random() * 900);
  return `COT-R${y}${m}${d}-${rand}`;
}

function calcularTotales(items: ItemRapido[]) {
  const subtotalMateriales = items
    .filter((i) => i.tipo === 'material')
    .reduce((acc, i) => acc + i.subtotal, 0);
  const subtotalManoObra = items
    .filter((i) => i.tipo === 'mano_obra')
    .reduce((acc, i) => acc + i.subtotal, 0);
  const otrosCostos = items
    .filter((i) => i.tipo === 'otro')
    .reduce((acc, i) => acc + i.subtotal, 0);
  const subtotalGeneral = subtotalMateriales + subtotalManoObra + otrosCostos;
  const iva = Math.round(subtotalGeneral * 0.19);
  const totalGeneral = Math.round(subtotalGeneral + iva);

  return {
    subtotalMateriales,
    subtotalManoObra,
    otrosCostos,
    subtotalGeneral,
    iva,
    totalGeneral,
  };
}

export function CotizacionRapidaView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idDesdeUrl = searchParams.get('id');
  const esNuevaParam = searchParams.get('nueva') === '1';

  const [cotizacionActivaId, setCotizacionActivaId] = useState<string>('');
  const [folio, setFolio] = useState<string>('');
  const [hidratado, setHidratado] = useState(false);

  // Datos referenciales del cliente / prospecto
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [proyectoTitulo, setProyectoTitulo] = useState('');
  const [direccionReferencia, setDireccionReferencia] = useState('');

  // Ítems del presupuesto activo
  const [items, setItems] = useState<ItemRapido[]>([]);
  const [tipo, setTipo] = useState<'material' | 'mano_obra' | 'otro'>('material');
  const [descripcion, setDescripcion] = useState('');
  const [cantidadStr, setCantidadStr] = useState('1');
  const [precioStr, setPrecioStr] = useState('');

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const limpiarFormularioParaNueva = () => {
    setCotizacionActivaId(generarId());
    setFolio(generarFolioRapido());
    setClienteNombre('');
    setClienteTelefono('');
    setProyectoTitulo('');
    setDireccionReferencia('');
    setItems([]);
    setDescripcion('');
    setCantidadStr('1');
    setPrecioStr('');
  };

  const aplicarCotizacion = (cot: CotizacionRapidaGuardada) => {
    setCotizacionActivaId(cot.id);
    setFolio(cot.folio || generarFolioRapido());
    setClienteNombre(cot.clienteNombre || '');
    setClienteTelefono(cot.clienteTelefono || '');
    setProyectoTitulo(cot.proyectoTitulo || '');
    setDireccionReferencia(cot.direccionReferencia || '');
    setItems(Array.isArray(cot.items) ? cot.items : []);
  };

  useEffect(() => {
    try {
      const ahora = Date.now();
      let listaInicial: CotizacionRapidaGuardada[] = [];

      const rawLista = window.localStorage.getItem(STORAGE_LIST_KEY);
      if (rawLista) {
        const parsed: CotizacionRapidaGuardada[] = JSON.parse(rawLista);
        if (Array.isArray(parsed)) {
          listaInicial = parsed.filter(
            (c) => c && c.savedAt && ahora - c.savedAt <= TTL_24_HORAS
          );
        }
      }

      const rawLegacy = window.localStorage.getItem(STORAGE_LEGACY_KEY);
      if (rawLegacy) {
        try {
          const leg = JSON.parse(rawLegacy);
          const tieneDatos =
            (Array.isArray(leg.items) && leg.items.length > 0) ||
            Boolean(leg.clienteNombre?.trim()) ||
            Boolean(leg.proyectoTitulo?.trim());

          if (leg.savedAt && ahora - leg.savedAt <= TTL_24_HORAS && tieneDatos) {
            const yaExiste = listaInicial.some((c) => c.folio === leg.folio);
            if (!yaExiste) {
              listaInicial = [
                {
                  id: generarId(),
                  savedAt: leg.savedAt,
                  folio: leg.folio || generarFolioRapido(),
                  clienteNombre: leg.clienteNombre || '',
                  clienteTelefono: leg.clienteTelefono || '',
                  proyectoTitulo: leg.proyectoTitulo || '',
                  direccionReferencia: leg.direccionReferencia || '',
                  items: Array.isArray(leg.items) ? leg.items : [],
                },
                ...listaInicial,
              ];
            }
          }
        } catch {
          // ignorar legacy inválido
        }
        window.localStorage.removeItem(STORAGE_LEGACY_KEY);
      }

      window.localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(listaInicial));

      if (esNuevaParam) {
        limpiarFormularioParaNueva();
        return;
      }

      if (idDesdeUrl) {
        const encontrada = listaInicial.find((c) => c.id === idDesdeUrl);
        if (encontrada) {
          aplicarCotizacion(encontrada);
          return;
        }
      }

      limpiarFormularioParaNueva();
    } catch (error) {
      console.error('Error al cargar cotizaciones rápidas:', error);
      limpiarFormularioParaNueva();
    } finally {
      setHidratado(true);
    }
  }, [idDesdeUrl, esNuevaParam]);

  const persistirCotizacionActual = (limpiarDespues = false) => {
    if (!cotizacionActivaId) return;

    try {
      const ahora = Date.now();
      const tieneContenido =
        items.length > 0 ||
        clienteNombre.trim() !== '' ||
        clienteTelefono.trim() !== '' ||
        proyectoTitulo.trim() !== '' ||
        direccionReferencia.trim() !== '';

      if (!tieneContenido) {
        if (limpiarDespues) {
          alert('Agrega al menos un dato o ítem antes de guardar la cotización rápida.');
        }
        return;
      }

      const rawLista = window.localStorage.getItem(STORAGE_LIST_KEY);
      let vigentes: CotizacionRapidaGuardada[] = [];
      if (rawLista) {
        const parsed = JSON.parse(rawLista);
        if (Array.isArray(parsed)) {
          vigentes = parsed.filter(
            (c: CotizacionRapidaGuardada) => c && c.savedAt && ahora - c.savedAt <= TTL_24_HORAS
          );
        }
      }

      const existente = vigentes.find((c) => c.id === cotizacionActivaId);
      const registroActualizado: CotizacionRapidaGuardada = {
        id: cotizacionActivaId,
        savedAt: existente?.savedAt || ahora,
        folio: folio || generarFolioRapido(),
        clienteNombre,
        clienteTelefono,
        proyectoTitulo,
        direccionReferencia,
        items,
      };

      const existeIndice = vigentes.findIndex((c) => c.id === cotizacionActivaId);
      let siguienteLista: CotizacionRapidaGuardada[];
      if (existeIndice >= 0) {
        siguienteLista = [...vigentes];
        siguienteLista[existeIndice] = registroActualizado;
      } else {
        siguienteLista = [registroActualizado, ...vigentes];
      }

      window.localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(siguienteLista));
      window.dispatchEvent(new Event('storage'));

      if (limpiarDespues) {
        limpiarFormularioParaNueva();
        router.replace('/dashboard/cotizaciones/rapida?nueva=1');
      }
    } catch (error) {
      console.error('Error al guardar cotización rápida:', error);
    }
  };

  useEffect(() => {
    if (!hidratado || !cotizacionActivaId) return;
    persistirCotizacionActual(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hidratado,
    cotizacionActivaId,
    folio,
    clienteNombre,
    clienteTelefono,
    proyectoTitulo,
    direccionReferencia,
    items,
  ]);

  const {
    subtotalMateriales,
    subtotalManoObra,
    otrosCostos,
    subtotalGeneral,
    iva,
    totalGeneral,
  } = calcularTotales(items);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = Number(cantidadStr);
    const precioNum = Number(precioStr);

    if (
      !descripcion.trim() ||
      isNaN(cantNum) ||
      cantNum <= 0 ||
      isNaN(precioNum) ||
      precioNum < 0
    ) {
      alert('Por favor, ingresa una descripción válida, cantidad mayor a 0 y precio válido.');
      return;
    }

    const nuevoItem: ItemRapido = {
      id: generarId(),
      tipo,
      descripcion: descripcion.trim(),
      cantidad: cantNum,
      precio_unitario: precioNum,
      subtotal: Math.round(cantNum * precioNum),
    };

    setItems((prev) => [...prev, nuevoItem]);
    setDescripcion('');
    setCantidadStr('1');
    setPrecioStr('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDownloadPDF = async () => {
    if (items.length === 0) {
      alert('Agrega al menos un ítem antes de descargar el PDF.');
      return;
    }

    const element = pdfRef.current;
    if (!element) return;

    setDownloadingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const nombreArchivo = clienteNombre.trim()
        ? `Presupuesto_${folio}_${clienteNombre.trim().replace(/\s+/g, '_')}.pdf`
        : `Presupuesto_${folio}.pdf`;

      const options = {
        margin: 10,
        filename: nombreArchivo,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      };

      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Hubo un error al generar el PDF.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (items.length === 0) {
      alert('Agrega al menos un ítem antes de compartir por WhatsApp.');
      return;
    }

    const telefonoLimpio = clienteTelefono.replace(/\D/g, '');
    const saludo = clienteNombre.trim() ? `Hola ${clienteNombre.trim()},` : 'Hola,';
    const refTrabajo = proyectoTitulo.trim()
      ? ` correspondiente a "${proyectoTitulo.trim()}"`
      : '';

    const texto = `${saludo} le comparto su cotización preliminar (${folio})${refTrabajo}. El total estimado del presupuesto es de $${formatearCLP(
      totalGeneral
    )} (IVA incluido). Quedo atento a cualquier consulta.`;

    const url = telefonoLimpio
      ? `https://api.whatsapp.com/send?phone=${telefonoLimpio}&text=${encodeURIComponent(texto)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank');
  };

  const fechaEmision = new Date().toLocaleDateString('es-CL');
  const nombrePdfCliente = clienteNombre.trim() || 'Cliente / Prospecto';
  const telefonoPdfCliente = clienteTelefono.trim() || 'No especificado';
  const proyectoPdfTitulo = proyectoTitulo.trim() || 'Cotización Rápida en Terreno';
  const direccionPdf = direccionReferencia.trim() || 'Por confirmar';

  return (
    <div className="space-y-6">
      {/* Barra superior con botón Guardar Cotización */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Link>
          <Link
            href="/dashboard/cotizaciones"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Ver módulo de Cotizaciones
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Vigente por 24 horas en este dispositivo.</span>
          </div>

          <button
            type="button"
            onClick={() => persistirCotizacionActual(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" /> Guardar Cotización
          </button>
        </div>
      </div>

      {/* Selector rápido entre cotizaciones vigentes */}
      <CotizacionesRapidasListado
        cotizacionActivaId={cotizacionActivaId}
        onSeleccionar={(cot) => {
          aplicarCotizacion(cot);
          router.replace(`/dashboard/cotizaciones/rapida?id=${encodeURIComponent(cot.id)}`);
        }}
        ocultarBotonNueva
        compacto
      />

      {/* Datos opcionales del destinatario */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Datos Referenciales del Cliente (Opcionales)
          </h3>
          <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Folio: {folio || 'Generando...'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Nombre Cliente / Prospecto
            </label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Teléfono WhatsApp</label>
            <input
              type="tel"
              placeholder="Ej: 56912345678"
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Trabajo / Referencia</label>
            <input
              type="text"
              placeholder="Ej: Cambio automático y tablero"
              value={proyectoTitulo}
              onChange={(e) => setProyectoTitulo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Dirección / Comuna</label>
            <input
              type="text"
              placeholder="Ej: Av. Principal 123, Paine"
              value={direccionReferencia}
              onChange={(e) => setDireccionReferencia(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Formulario para añadir ítems */}
      <form
        onSubmit={handleAddItem}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
      >
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" /> Añadir Ítem al Presupuesto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Categoría</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'material' | 'mano_obra' | 'otro')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
            >
              <option value="material">Material / Insumo</option>
              <option value="mano_obra">Mano de Obra</option>
              <option value="otro">Otro Costo</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">Descripción del Ítem</label>
            <input
              type="text"
              placeholder="Ej: Automático 1x16A curva C + instalación"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Cantidad</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1"
              value={cantidadStr}
              onChange={(e) => setCantidadStr(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">Precio Unitario ($ CLP)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 18500"
              value={precioStr}
              onChange={(e) => setPrecioStr(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar al Listado
            </button>
          </div>
        </div>
      </form>

      {/* Tabla de ítems y acciones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Presupuesto Rápido — {folio || 'Nuevo'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Destinatario: <span className="font-semibold text-slate-700">{nombrePdfCliente}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => persistirCotizacionActual(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" /> Guardar Cotización
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf || items.length === 0}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {downloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Descargar PDF
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              disabled={items.length === 0}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" /> Compartir WhatsApp
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100 tracking-wider">
              <tr>
                <th className="p-3">Tipo</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-center">Cant.</th>
                <th className="p-3 text-right">P. Unitario</th>
                <th className="p-3 text-right">Subtotal</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-bold uppercase text-slate-500 text-[10px]">
                      {item.tipo === 'mano_obra' ? 'Mano de Obra' : item.tipo}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{item.descripcion}</td>
                    <td className="p-3 text-center font-semibold text-slate-700">{item.cantidad}</td>
                    <td className="p-3 text-right text-slate-600">
                      ${formatearCLP(item.precio_unitario)}
                    </td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      ${formatearCLP(item.subtotal)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Agrega materiales o mano de obra arriba para armar la cotización rápida.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50/75 p-5 rounded-2xl border border-slate-200 space-y-4 max-w-md ml-auto">
          <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">
            Resumen General
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal Materiales e Insumos:</span>
              <span>${formatearCLP(subtotalMateriales)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal Mano de Obra:</span>
              <span>${formatearCLP(subtotalManoObra)}</span>
            </div>
            {otrosCostos > 0 && (
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Otros Servicios / Costos:</span>
                <span>${formatearCLP(otrosCostos)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 font-medium border-t border-slate-200 pt-2">
              <span>IVA (19%):</span>
              <span>${formatearCLP(iva)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2 mt-1">
              <span>Total Presupuesto:</span>
              <span className="text-base text-blue-600">${formatearCLP(totalGeneral)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            Guarda esta cotización para revisarla luego. Si el cliente acepta, regístralo aquí:
          </p>

          <Link
            href="/dashboard/clientes/nuevo"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Fidelizar / Registrar Cliente
          </Link>
        </div>

        {/* CONTENEDOR OCULTO PARA GENERAR EL PDF */}
        <div style={{ display: 'none' }}>
          <div
            ref={pdfRef}
            style={{
              padding: '25px',
              fontFamily: 'sans-serif',
              color: '#1e293b',
              background: '#ffffff',
              fontSize: '11px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '2px solid #0f172a',
                paddingBottom: '15px',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <div
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ⚡
                  </div>
                  <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0' }}>
                    PGTE
                  </h1>
                </div>
                <p style={{ fontSize: '10px', color: '#64748b', margin: '0' }}>
                  Plataforma de Gestión Técnica Eléctrica
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    margin: '0 0 5px 0',
                    textTransform: 'uppercase',
                  }}
                >
                  COTIZACIÓN
                </h2>
                <p style={{ fontSize: '11px', color: '#475569', margin: '0' }}>
                  Nº Cotización: <strong>{folio}</strong>
                </p>
                <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0 0' }}>
                  Fecha: <strong>{fechaEmision}</strong>
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#f1f5f9',
                    padding: '6px 10px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #cbd5e1',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: '#475569',
                  }}
                >
                  Técnico / Empresa Proveedora
                </div>
                <div style={{ padding: '10px', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>Nombre:</strong> Marcelo
                  </p>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>Especialidad:</strong> Instalador / Técnico Eléctrico
                  </p>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>Referencia:</strong> {proyectoPdfTitulo}
                  </p>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#f1f5f9',
                    padding: '6px 10px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #cbd5e1',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: '#475569',
                  }}
                >
                  Cliente / Destinatario
                </div>
                <div style={{ padding: '10px', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>Nombre:</strong> {nombrePdfCliente}
                  </p>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>Teléfono:</strong> {telefonoPdfCliente}
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong>Ubicación:</strong> {direccionPdf}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                fontWeight: 'bold',
                fontSize: '11px',
                color: '#0f172a',
                marginBottom: '8px',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '4px',
              }}
            >
              Descripción de Servicios y Cotización
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
                fontSize: '10px',
              }}
            >
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #0f172a', width: '35%' }}>
                    DESCRIPCIÓN
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: '1px solid #0f172a',
                      textAlign: 'center',
                      width: '15%',
                    }}
                  >
                    TIPO
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: '1px solid #0f172a',
                      textAlign: 'center',
                      width: '15%',
                    }}
                  >
                    CANT.
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: '1px solid #0f172a',
                      textAlign: 'right',
                      width: '17%',
                    }}
                  >
                    P. UNITARIO
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      border: '1px solid #0f172a',
                      textAlign: 'right',
                      width: '18%',
                    }}
                  >
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '7px 8px', border: '1px solid #cbd5e1' }}>
                      {item.descripcion}
                    </td>
                    <td
                      style={{
                        padding: '7px 8px',
                        border: '1px solid #cbd5e1',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.tipo === 'mano_obra' ? 'MANO OBRA' : item.tipo}
                    </td>
                    <td
                      style={{
                        padding: '7px 8px',
                        border: '1px solid #cbd5e1',
                        textAlign: 'center',
                      }}
                    >
                      {item.cantidad}
                    </td>
                    <td
                      style={{
                        padding: '7px 8px',
                        border: '1px solid #cbd5e1',
                        textAlign: 'right',
                      }}
                    >
                      ${formatearCLP(item.precio_unitario)}
                    </td>
                    <td
                      style={{
                        padding: '7px 8px',
                        border: '1px solid #cbd5e1',
                        textAlign: 'right',
                        fontWeight: 'bold',
                      }}
                    >
                      ${formatearCLP(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
              <div
                style={{
                  width: '250px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <span>Subtotal:</span>
                  <strong>${formatearCLP(subtotalGeneral)}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <span>IVA (19%):</span>
                  <strong>${formatearCLP(iva)}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                >
                  <span>TOTAL:</span>
                  <span>${formatearCLP(totalGeneral)}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: '9px',
                color: '#64748b',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '10px',
              }}
            >
              Documento generado digitalmente a través de PGTE (Plataforma de Gestión Técnica Eléctrica). Válido como presupuesto comercial preliminar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}