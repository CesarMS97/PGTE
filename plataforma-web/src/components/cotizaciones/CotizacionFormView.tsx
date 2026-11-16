'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { agregarItemCotizacion, eliminarItemCotizacion, finalizarCotizacion } from '@/services/cotizaciones.service';
import { Plus, Trash2, CheckCircle2, Loader2, Download, MessageSquare } from 'lucide-react';

interface CotizacionFormViewProps {
  proyectoId: string;
  initialCotizacion: any;
}

export function CotizacionFormView({ proyectoId, initialCotizacion }: CotizacionFormViewProps) {
  const router = useRouter();
  const [cotizacion, setCotizacion] = useState(initialCotizacion);
  const [items, setItems] = useState<any[]>(initialCotizacion?.cotizacion_items || []);

  const [tipo, setTipo] = useState('material');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);

  const [adding, setAdding] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Referencia para capturar exclusivamente el formato limpio para el cliente
  const pdfRef = useRef<HTMLDivElement>(null);

  // Cálculos dinámicos en tiempo real
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
  const iva = subtotalGeneral * 0.19;
  const totalGeneral = subtotalGeneral + iva;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || cantidad <= 0 || precioUnitario < 0) return;

    setAdding(true);

    const res = await agregarItemCotizacion({
      cotizacionId: cotizacion.id,
      proyectoId,
      tipo,
      descripcion,
      cantidad,
      precioUnitario,
    });

    if (res.success && res.item) {
      setItems((prev) => [...prev, res.item]);
      setDescripcion('');
      setCantidad(1);
      setPrecioUnitario(0);
    } else {
      alert('Error al agregar el ítem: ' + res.error);
    }

    setAdding(false);
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

  // Función que genera y descarga el PDF limpio mediante html2pdf.js con tipos corregidos
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
        margin:       15,
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
    const telefonoCliente = initialCotizacion?.proyectos?.inmuebles?.clientes?.telefono || '';
    const proyectoTitulo = initialCotizacion?.proyectos?.titulo || 'Proyecto eléctrico';
    
    const texto = `Hola, le escribo para compartirle el envío de su cotización (${cotizacion.numero}) correspondiente al proyecto "${proyectoTitulo}". El total del presupuesto es de $${totalGeneral.toLocaleString('es-CL')} (IVA incluido). Quedo atento a cualquier duda.`;
    
    const url = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const clienteNombre = initialCotizacion?.proyectos?.inmuebles?.clientes?.nombre || 'N/A';
  const proyectoTitulo = initialCotizacion?.proyectos?.titulo || 'Proyecto eléctrico';

  return (
    <div className="space-y-6">
      {/* Formulario para añadir ítems (Uso técnico exclusivo interno) */}
      <form onSubmit={handleAddItem} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" /> Añadir Ítem al Presupuesto (Uso Técnico Interno)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Categoría</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
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
              placeholder="Ej: Tablero eléctrico de 12 polos sobrepuesto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">Precio Unitario ($ CLP)</label>
            <input
              type="number"
              min="0"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(Number(e.target.value))}
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

      {/* Contenedor principal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        
        {/* Cabecera y botón de descarga directa del PDF */}
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

        {/* Tabla Detallada Interna (Visible en pantalla solo para ti) */}
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
                      <td className="p-3 text-right text-slate-600">${Number(item.precio_unitario).toLocaleString('es-CL')}</td>
                      <td className="p-3 text-right font-extrabold text-slate-900">${Number(item.subtotal).toLocaleString('es-CL')}</td>
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

        {/* CONTENEDOR OCULTO EXCLUSIVO PARA EL PDF DEL CLIENTE 
            (Contiene únicamente el Resumen General sin revelar insumos ni proveedores) */}
        <div style={{ display: 'none' }}>
          <div ref={pdfRef} style={{ padding: '20px', fontFamily: 'sans-serif', color: '#1e293b', background: '#ffffff' }}>
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Presupuesto Comercial</h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>Folio: <strong>{cotizacion.numero}</strong> | Proyecto: {proyectoTitulo}</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0 0' }}>Cliente: <strong>{clienteNombre}</strong></p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', maxWidth: '350px', marginLeft: 'auto' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: '0 0 12px 0' }}>Resumen General</h4>
              
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal Materiales e Insumos:</span>
                <strong>${subtotalMateriales.toLocaleString('es-CL')}</strong>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal Mano de Obra:</span>
                <strong>${subtotalManoObra.toLocaleString('es-CL')}</strong>
              </div>
              {otrosCostos > 0 && (
                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Otros Servicios / Costos:</span>
                  <strong>${otrosCostos.toLocaleString('es-CL')}</strong>
                </div>
              )}
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginBottom: '8px' }}>
                <span>IVA (19%):</span>
                <strong>${iva.toLocaleString('es-CL')}</strong>
              </div>
              <div style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #cbd5e1', paddingTop: '10px', fontWeight: 'bold', color: '#2563eb' }}>
                <span>Total Presupuesto:</span>
                <span>${totalGeneral.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen General visible en pantalla */}
        <div className="bg-slate-50/75 p-5 rounded-2xl border border-slate-200 space-y-4 max-w-md ml-auto">
          <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">Resumen General</h4>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal Materiales e Insumos:</span>
              <span>${subtotalMateriales.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal Mano de Obra:</span>
              <span>${subtotalManoObra.toLocaleString('es-CL')}</span>
            </div>
            {otrosCostos > 0 && (
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Otros Servicios / Costos:</span>
                <span>${otrosCostos.toLocaleString('es-CL')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 font-medium border-t border-slate-200 pt-2">
              <span>IVA (19%):</span>
              <span>${iva.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2 mt-1">
              <span>Total Presupuesto:</span>
              <span className="text-base text-blue-600">${totalGeneral.toLocaleString('es-CL')}</span>
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