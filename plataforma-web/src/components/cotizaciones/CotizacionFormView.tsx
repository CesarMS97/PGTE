'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { agregarItemCotizacion, eliminarItemCotizacion, finalizarCotizacion } from '@/services/cotizaciones.service';
import { Plus, Trash2, CheckCircle2, Loader2, Download, MessageSquare, ClipboardCheck, ShieldAlert, ChevronDown, ChevronUp, User, Building2, MapPin, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { materialesElectricos } from "@/data/materialesElectricos";

interface CotizacionFormViewProps {
  proyectoId: string;
  initialCotizacion: any;
  levantamiento?: any;
  clienteInfo?: { nombre: string; telefono?: string | null };
  inmuebleInfo?: { direccion: string; comuna: string; referencia?: string | null };
}

function parsearHallazgosParaVista(raw?: string | null): string[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {}
  return raw
    .split('\n')
    .map((linea) => linea.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

function formatearCLP(valor: number): string {
  return Math.round(valor).toLocaleString('es-CL');
}

export function CotizacionFormView({ 
  proyectoId, 
  initialCotizacion, 
  levantamiento, 
  clienteInfo, 
  inmuebleInfo 
}: CotizacionFormViewProps) {
  const router = useRouter();
  const [cotizacion, setCotizacion] = useState(initialCotizacion);
  const [items, setItems] = useState<any[]>(initialCotizacion?.cotizacion_items || []);

  const [tipo, setTipo] = useState('material');
  const [descripcion, setDescripcion] = useState('');
  const [cantidadStr, setCantidadStr] = useState('1');
  const [precioStr, setPrecioStr] = useState('');
  const [familiaMaterial, setFamiliaMaterial] = useState('Canalizaciones');
  const [materialSeleccionado, setMaterialSeleccionado] = useState('Conduit PVC 16 mm');
  const [materialManual, setMaterialManual] = useState(false);
  const [agregarDescripcion, setAgregarDescripcion] = useState(false);
  const [descripcionAdicional, setDescripcionAdicional] = useState('');

  const descripcionBase = tipo === 'material' && !materialManual
    ? materialSeleccionado
    : descripcion;

  const descripcionFinal = tipo === 'material' && agregarDescripcion && descripcionAdicional.trim()
    ? `${descripcionBase.trim()} — ${descripcionAdicional.trim()}`
    : descripcionBase.trim();

  const [adding, setAdding] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [mostrarLevantamiento, setMostrarLevantamiento] = useState(true);

  // Estado local para los hallazgos permitiendo reordenamiento táctil con botones
  const rawHallazgos = parsearHallazgosParaVista(levantamiento?.observaciones);
  const [hallazgosList, setHallazgosList] = useState<string[]>(rawHallazgos);

  const pdfRef = useRef<HTMLDivElement>(null);

  const moverHallazgo = (index: number, direccion: 'arriba' | 'abajo') => {
    const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= hallazgosList.length) return;
    const copia = [...hallazgosList];
    const temp = copia[index];
    copia[index] = copia[nuevoIndex];
    copia[nuevoIndex] = temp;
    setHallazgosList(copia);
  };

  const subtotalMateriales = items
    .filter((i) => i.tipo === 'material')
    .reduce((acc, i) => acc + Number(i.subtotal || 0), 0);

  const subtotalManoObra = items
    .filter((i) => i.tipo === 'mano_obra')
    .reduce((acc, i) => acc + Number(i.subtotal || 0), 0);

  const otrosCostos = items
    .filter((i) => i.tipo !== 'material' && i.tipo !== 'mano_obra')
    .reduce((acc, i) => acc + Number(i.subtotal || 0), 0);

  const subtotalGeneral = subtotalMateriales + subtotalManoObra + otrosCostos;
  const iva = Math.round(subtotalGeneral * 0.19);
  const totalGeneral = Math.round(subtotalGeneral + iva);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adding) return;

    const cantNum = Number(cantidadStr);
    const precioNum = Number(precioStr);

    if (!descripcionFinal.trim() || !Number.isFinite(cantNum) || cantNum <= 0 || !Number.isFinite(precioNum) || precioNum < 0) {
      alert('Por favor, ingresa una descripción válida, cantidad mayor a 0 y precio válido.');
      return;
    }

    if (tipo === 'material' && agregarDescripcion && !descripcionAdicional.trim()) {
      alert('Ingresa una descripción adicional o desmarca la casilla.');
      return;
    }

    setAdding(true);
    try {
      const res = await agregarItemCotizacion({
        cotizacionId: cotizacion.id,
        proyectoId,
        tipo,
        descripcion: descripcionFinal.trim(),
        cantidad: cantNum,
        precioUnitario: precioNum,
      });

      if (res.success && res.item) {
        setItems((prev) => [...prev, res.item]);
        setDescripcion('');
        setMaterialManual(false);
        setAgregarDescripcion(false);
        setDescripcionAdicional('');
        setCantidadStr('1');
        setPrecioStr('');
      } else {
        alert('Error al agregar el ítem: ' + res.error);
      }
    } catch (error) {
      console.error('Error al agregar ítem:', error);
      alert('No fue posible agregar el ítem al presupuesto.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const prevItems = [...items];
    setItems((prev) => prev.filter((i) => i.id !== itemId));

    const res = await eliminarItemCotizacion(itemId, cotizacion.id);
    if (!res.success) {
      setItems(prevItems);
      alert('Error al eliminar el ítem: ' + res.error);
    }
  };

  const handleFinalizar = async () => {
    if (items.length === 0) {
      alert('Debes agregar al menos un ítem a la cotización antes de finalizar.');
      return;
    }

    setFinalizing(true);
    const res = await finalizarCotizacion(cotizacion.id);

    if (res.success) {
      router.push('/dashboard/cotizaciones');
      router.refresh();
    } else {
      alert('Error al finalizar la cotización: ' + res.error);
      setFinalizing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (items.length === 0) {
      alert('No hay elementos en la cotización para exportar.');
      return;
    }

    const element = pdfRef.current;
    if (!element) return;

    setDownloadingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const options = {
        margin:       10,
        filename:     `Presupuesto_${cotizacion.numero}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
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
    const telefonoCliente = clienteInfo?.telefono || '';
    const proyectoTitulo = initialCotizacion?.proyectos?.titulo || 'Proyecto eléctrico';
    
    const texto = `Hola, le escribo para compartirle el envío de su cotización (${cotizacion.numero}) correspondiente al proyecto "${proyectoTitulo}". El total del presupuesto es de $${formatearCLP(totalGeneral)} (IVA incluido). Quedo atento a cualquier duda.`;
    
    const url = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const clienteNombre = clienteInfo?.nombre || initialCotizacion?.proyectos?.inmuebles?.clientes?.nombre || 'N/A';
  const clienteTelefono = clienteInfo?.telefono || 'No registrado';
  const proyectoTitulo = initialCotizacion?.proyectos?.titulo || 'Proyecto eléctrico';
  const nombreInmueble = inmuebleInfo?.referencia || initialCotizacion?.proyectos?.inmuebles?.nombre_referencia || 'Inmueble Principal';
  const direccionInmueble = inmuebleInfo?.direccion || initialCotizacion?.proyectos?.inmuebles?.direccion || 'Sin dirección';
  const comunaInmueble = inmuebleInfo?.comuna || initialCotizacion?.proyectos?.inmuebles?.comuna || 'Sin comuna';
  const fechaEmision = new Date().toLocaleDateString('es-CL');

  return (
    <div className="space-y-6">

      {/* Tarjeta de Referencia: Cliente, Inmueble y Hallazgos del Levantamiento */}
      {levantamiento ? (
        <div className="bg-gradient-to-br from-slate-900 to-[#0D2345] text-white rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
          <div 
            onClick={() => setMostrarLevantamiento(!mostrarLevantamiento)}
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/40 text-blue-300 rounded-xl">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Inspección de Terreno y Hallazgos Registrados</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Cliente, dirección del inmueble y parámetros eléctricos relevados.
                </p>
              </div>
            </div>
            <button type="button" className="text-slate-300 hover:text-white p-1">
              {mostrarLevantamiento ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {mostrarLevantamiento && (
            <div className="px-5 pb-5 pt-1 border-t border-white/10 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/30 p-4 rounded-xl border border-white/10">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">Cliente Solicitante</span>
                    <strong className="text-white text-sm block">{clienteNombre}</strong>
                    <span className="text-slate-300 text-[11px]">Tel: {clienteTelefono}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">Inmueble / Ubicación</span>
                    <strong className="text-white text-sm block">{nombreInmueble}</strong>
                    <span className="text-slate-300 text-[11px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {direccionInmueble}, {comunaInmueble}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Instalación</span>
                  <span className="font-bold text-white">{levantamiento.tipo_instalacion || 'No especificada'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Empalme</span>
                  <span className="font-bold text-white">{levantamiento.tipo_empalme || 'No especificado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tensión / Potencia</span>
                  <span className="font-bold text-white">{levantamiento.tension_nominal_v || '—'} V / {levantamiento.potencia_contratada_kw || '—'} kW</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Puesta a Tierra</span>
                  <span className={`font-bold ${levantamiento.puesta_tierra ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {levantamiento.puesta_tierra ? `Sí (${levantamiento.resistencia_tierra_ohm ?? '—'} Ω)` : 'No / Deficiente'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Hallazgos y Observaciones de Terreno ({hallazgosList.length})
                </span>

                {hallazgosList.length > 0 ? (
                  <ul className="space-y-2">
                    {hallazgosList.map((hallazgo, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-3 bg-white/10 p-3 rounded-xl border border-white/5 text-slate-200">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{hallazgo}</span>
                        </div>
                        {/* Botones de control táctil optimizados para celulares y tablets */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => moverHallazgo(idx, 'arriba')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 disabled:opacity-30 cursor-pointer transition-colors"
                            title="Mover arriba"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moverHallazgo(idx, 'abajo')}
                            disabled={idx === hallazgosList.length - 1}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 disabled:opacity-30 cursor-pointer transition-colors"
                            title="Mover abajo"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 italic bg-white/5 p-3 rounded-lg">
                    No se registraron hallazgos detallados en el levantamiento.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Este proyecto no cuenta con un formulario de levantamiento técnico asociado todavía.</span>
        </div>
      )}

      {/* Formulario para añadir ítems */}
      <form onSubmit={handleAddItem} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" /> Añadir Ítem al Presupuesto (Uso Técnico Interno)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Categoría</label>
            <select
              value={tipo}
              onChange={(e) => { setTipo(e.target.value); setDescripcion(''); setMaterialManual(false); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
            >
              <option value="material">Material / Insumo</option>
              <option value="mano_obra">Mano de Obra</option>
              <option value="otro">Otro Costo</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-3">
            {tipo === 'material' ? (
              <>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Familia de materiales</label>
                  <select
                    value={familiaMaterial}
                    disabled={materialManual}
                    onChange={(e) => {
                      const nuevaFamilia = e.target.value;
                      setFamiliaMaterial(nuevaFamilia);
                      setMaterialSeleccionado(materialesElectricos[nuevaFamilia]?.[0] ?? '');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white disabled:opacity-50"
                  >
                    {Object.keys(materialesElectricos).map((familia) => (
                      <option key={familia} value={familia}>{familia}</option>
                    ))}
                  </select>
                </div>

                {!materialManual && (
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Material y medida</label>
                    <select
                      value={materialSeleccionado}
                      onChange={(e) => setMaterialSeleccionado(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white"
                      required
                    >
                      {materialesElectricos[familiaMaterial]?.map((material) => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>
                )}

                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={materialManual}
                    onChange={(e) => {
                      setMaterialManual(e.target.checked);
                      setDescripcion('');
                    }}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Mi material no está en la lista
                </label>

                {materialManual && (
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Descripción personalizada</label>
                    <input
                      type="text"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Ej: Conduit especial 40 mm"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white"
                      required
                    />
                  </div>
                )}

                {/* Descripción adicional opcional */}
                <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={agregarDescripcion}
                      onChange={(e) => {
                        setAgregarDescripcion(e.target.checked);
                        if (!e.target.checked) setDescripcionAdicional('');
                      }}
                      className="h-4 w-4 accent-blue-600"
                    />
                    Agregar descripción adicional
                  </label>
                  {agregarDescripcion && (
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Descripción adicional</label>
                      <textarea
                        value={descripcionAdicional}
                        onChange={(e) => setDescripcionAdicional(e.target.value)}
                        placeholder="Ej: 25 metros, color rojo, instalación interior"
                        rows={2}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Descripción del Ítem</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder={tipo === 'mano_obra' ? 'Ej: Instalación de canalización eléctrica' : 'Ej: Transporte de materiales'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Cantidad</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1"
              value={cantidadStr}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setCantidadStr(val);
              }}
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
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPrecioStr(val);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={adding}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Agregando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Agregar al Listado
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Contenedor principal de ítems y totales */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Presupuesto — Folio: {cotizacion.numero}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cliente: <span className="font-semibold text-slate-700">{clienteNombre}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf || items.length === 0}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Descargar PDF Cliente
            </button>
          </div>
        </div>

        {/* Tabla Detallada Interna */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Detalle de Costes y Servicios (Uso Interno)</h4>
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
                      <td className="p-3 font-bold uppercase text-slate-500 text-[10px]">{item.tipo}</td>
                      <td className="p-3 font-bold text-slate-900">{item.descripcion}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{item.cantidad}</td>
                      <td className="p-3 text-right text-slate-600">${formatearCLP(Number(item.precio_unitario))}</td>
                      <td className="p-3 text-right font-extrabold text-slate-900">${formatearCLP(Number(item.subtotal))}</td>
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
                      Aún no hay elementos añadidos a esta cotización.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CONTENEDOR OCULTO PARA EL PDF DEL CLIENTE */}
        <div style={{ display: 'none' }}>
          <div ref={pdfRef} style={{ padding: '25px', fontFamily: 'sans-serif', color: '#1e293b', background: '#ffffff', fontSize: '11px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <div style={{ background: '#2563eb', color: '#ffffff', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ⚡
                  </div>
                  <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0' }}>PGTE</h1>
                </div>
                <p style={{ fontSize: '10px', color: '#64748b', margin: '0' }}>Plataforma de Gestión Técnica Eléctrica</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0', textTransform: 'uppercase' }}>COTIZACIÓN</h2>
                <p style={{ fontSize: '11px', color: '#475569', margin: '0' }}>Nº Cotización: <strong>{cotizacion.numero}</strong></p>
                <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0 0' }}>Fecha: <strong>{fechaEmision}</strong></p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '6px 10px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', fontSize: '10px', textTransform: 'uppercase', color: '#475569' }}>
                  Técnico / Empresa Proveedora
                </div>
                <div style={{ padding: '10px', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Nombre:</strong> Marcelo Tapia</p>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Especialidad:</strong> Instalador / Técnico Eléctrico</p>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Proyecto:</strong> {proyectoTitulo}</p>
                </div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '6px 10px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', fontSize: '10px', textTransform: 'uppercase', color: '#475569' }}>
                  Cliente / Destinatario
                </div>
                <div style={{ padding: '10px', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Nombre:</strong> {clienteNombre}</p>
                  <p style={{ margin: '0 0 3px 0' }}><strong>Teléfono:</strong> {clienteTelefono}</p>
                  <p style={{ margin: '0' }}><strong>Inmueble / Dir:</strong> {nombreInmueble} ({direccionInmueble}, {comunaInmueble})</p>
                </div>
              </div>
            </div>

            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
              Descripción de Servicios y Cotización
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '10px' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #0f172a', width: '35%' }}>DESCRIPCIÓN</th>
                  <th style={{ padding: '8px', border: '1px solid #0f172a', textAlign: 'center', width: '15%' }}>TIPO</th>
                  <th style={{ padding: '8px', border: '1px solid #0f172a', textAlign: 'center', width: '15%' }}>CANT.</th>
                  <th style={{ padding: '8px', border: '1px solid #0f172a', textAlign: 'right', width: '17%' }}>P. UNITARIO</th>
                  <th style={{ padding: '8px', border: '1px solid #0f172a', textAlign: 'right', width: '18%' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '7px 8px', border: '1px solid #cbd5e1' }}>{item.descripcion}</td>
                    <td style={{ padding: '7px 8px', border: '1px solid #cbd5e1', textAlign: 'center', textTransform: 'uppercase' }}>{item.tipo}</td>
                    <td style={{ padding: '7px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{item.cantidad}</td>
                    <td style={{ padding: '7px 8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>${formatearCLP(Number(item.precio_unitario))}</td>
                    <td style={{ padding: '7px 8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold' }}>${formatearCLP(Number(item.subtotal))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
              <div style={{ width: '250px', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <span>Subtotal:</span>
                  <strong>${formatearCLP(subtotalGeneral)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <span>IVA (19%):</span>
                  <strong>${formatearCLP(iva)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f172a', color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}>
                  <span>TOTAL:</span>
                  <span>${formatearCLP(totalGeneral)}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '9px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              Documento generado digitalmente a través de PGTE (Plataforma de Gestión Técnica Eléctrica). Válido como presupuesto comercial.
            </div>

          </div>
        </div>

        {/* Resumen General visible en pantalla */}
        <div className="bg-slate-50/75 p-5 rounded-2xl border border-slate-200 space-y-4 max-w-md ml-auto">
          <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">Resumen General</h4>
          
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

        {/* Acciones de Cierre */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            Al finalizar, el presupuesto se registrará en el sistema.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Enviar por WhatsApp
            </button>

            <button
              type="button"
              onClick={handleFinalizar}
              disabled={finalizing || items.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {finalizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Finalizar Cotización
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}