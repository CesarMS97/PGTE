
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Zap, X } from "lucide-react";
import CalculadorasElectricas from "./CalculadorasElectricas";

export default function CalculadoraModal() {
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);

  const botonRef = useRef<HTMLButtonElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (!abierto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cerrarRef.current?.focus();

    function manejarTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAbierto(false);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const elementos = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), textarea:not([disabled]), ' +
            'a[href], [tabindex]:not([tabindex="-1"])'
        )
      );

      if (elementos.length === 0) return;

      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === primero
      ) {
        event.preventDefault();
        ultimo.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === ultimo
      ) {
        event.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", manejarTeclado);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", manejarTeclado);
      botonRef.current?.focus();
    };
  }, [abierto]);

  return (
    <>
      {/* Botón flotante */}
      <button
        ref={botonRef}
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir calculadora eléctrica"
        title="Herramientas de cálculo eléctrico"
        className="
          group fixed bottom-6 right-6 z-40
          flex items-center gap-2.5
          rounded-xl
          border border-slate-700
          bg-slate-800
          px-4 py-3
          text-sm font-medium text-white
          shadow-md shadow-slate-900/10
          transition-all duration-200
          hover:border-slate-600
          hover:bg-slate-700
          hover:shadow-lg
          active:scale-[0.98]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-blue-600
        "
      >
        <Zap
          size={18}
          strokeWidth={1.8}
          className="
            text-blue-300
            transition-colors
            group-hover:text-blue-200
          "
        />

        <span>Calculadora</span>
      </button>

      {/* Ventana flotante */}
      {montado &&
        abierto &&
        createPortal(
          <div
            className="
              fixed inset-0 z-[100]
              flex items-center justify-center
              bg-slate-950/60
              p-3 backdrop-blur-[2px]
              sm:p-6
            "
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setAbierto(false);
              }
            }}
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-calculadora"
              className="
                flex max-h-[90dvh] w-full max-w-2xl
                flex-col overflow-hidden
                rounded-2xl border border-slate-200
                bg-slate-50 shadow-2xl
              "
            >
              {/* Encabezado */}
              <div
                className="
                  flex shrink-0 items-center
                  justify-between gap-3
                  border-b border-slate-200
                  bg-white px-5 py-4
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-xl bg-slate-100
                    "
                  >
                    <Zap
                      size={21}
                      strokeWidth={1.8}
                      className="text-blue-700"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2
                      id="titulo-calculadora"
                      className="
                        text-base font-semibold
                        text-slate-900
                      "
                    >
                      Calculadora eléctrica
                    </h2>

                    <p className="text-xs text-slate-500">
                      Herramientas técnicas · PGTE
                    </p>
                  </div>
                </div>

                <button
                  ref={cerrarRef}
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar calculadora"
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-lg text-slate-500
                    transition-colors
                    hover:bg-slate-100
                    hover:text-slate-900
                    focus-visible:outline-2
                    focus-visible:outline-blue-600
                  "
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido */}
              <div
                className="
                  min-h-0 flex-1 overflow-y-auto
                  overscroll-contain
                  p-4 sm:p-6
                "
              >
                <CalculadorasElectricas />
              </div>

              {/* Pie de ventana */}
              <div
                className="
                  flex shrink-0 items-center
                  justify-between gap-2
                  border-t border-slate-200
                  bg-white px-5 py-3
                "
              >
                <span className="text-xs text-slate-400">
                  PGTE · Gestión Técnica Eléctrica
                </span>

                <span className="text-xs text-slate-400">
                  Cálculo referencial
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
