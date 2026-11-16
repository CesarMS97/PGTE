
"use client";

import { useState } from "react";
import {
  Activity,
  Calculator,
  Check,
  Copy,
  RotateCcw,
  Zap,
} from "lucide-react";

import {
  calcularCaidaTension,
  calcularCorriente,
  calcularPotencia,
  RESISTENCIAS_COBRE,
  type Seccion,
  type Sistema,
} from "@/lib/electrica/calculos";

type Herramienta = "potencia" | "caida";
type Operacion = "corriente" | "potencia";

const campo =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 " +
  "text-slate-900 outline-none focus:border-blue-500 " +
  "focus:ring-2 focus:ring-blue-100";

const etiqueta = "mb-1.5 block text-sm font-medium text-slate-700";

function numero(valor: string): number {
  return valor.trim() === "" ? NaN : Number(valor);
}

function formato(valor: number, decimales = 2) {
  return valor.toLocaleString("es-CL", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

function obtenerResultado<T>(calcular: () => T): {
  dato: T | null;
  error: string;
} {
  try {
    return { dato: calcular(), error: "" };
  } catch (error) {
    return {
      dato: null,
      error:
        error instanceof Error
          ? error.message
          : "Datos inválidos.",
    };
  }
}

export default function CalculadorasElectricas() {
  const [herramienta, setHerramienta] =
    useState<Herramienta>("potencia");

  const [sistema, setSistema] =
    useState<Sistema>("monofasico");

  const [operacion, setOperacion] =
    useState<Operacion>("corriente");

  // Campos vacíos por defecto
  const [tension, setTension] = useState("");
  const [valor, setValor] = useState("");
  const [fp, setFp] = useState("");

  const [corriente, setCorriente] = useState("");
  const [longitud, setLongitud] = useState("");
  const [seccion, setSeccion] = useState<Seccion>(2.5);
  const [limite, setLimite] = useState("3");

  const [copiado, setCopiado] = useState(false);

  // Comprobar campos completos
  const datosPotenciaCompletos =
    tension.trim() !== "" &&
    valor.trim() !== "" &&
    fp.trim() !== "";

  const datosCaidaCompletos =
    tension.trim() !== "" &&
    corriente.trim() !== "" &&
    longitud.trim() !== "" &&
    fp.trim() !== "";

  // Calcular potencia / corriente
  const resultadoPotencia = datosPotenciaCompletos
    ? obtenerResultado(() =>
        operacion === "corriente"
          ? calcularCorriente(
              numero(valor),
              numero(tension),
              numero(fp),
              sistema
            )
          : calcularPotencia(
              numero(valor),
              numero(tension),
              numero(fp),
              sistema
            )
      )
    : { dato: null as number | null, error: "" };

  // Calcular caída de tensión
  const resultadoCaida = datosCaidaCompletos
    ? obtenerResultado(() =>
        calcularCaidaTension(
          numero(tension),
          numero(corriente),
          numero(longitud),
          seccion,
          numero(fp),
          sistema
        )
      )
    : {
        dato: null as ReturnType<
          typeof calcularCaidaTension
        > | null,
        error: "",
      };

  const resultado =
    herramienta === "potencia"
      ? resultadoPotencia.dato
      : resultadoCaida.dato;

  const error =
    herramienta === "potencia"
      ? resultadoPotencia.error
      : resultadoCaida.error;

  // Cambiar sistema eléctrico
  function cambiarSistema(nuevo: Sistema) {
    setSistema(nuevo);
    setTension("");
    setCopiado(false);
  }

  // Limpiar completamente los datos
  function limpiar() {
    setSistema("monofasico");
    setOperacion("corriente");

    setTension("");
    setValor("");
    setFp("");
    setCorriente("");
    setLongitud("");

    setSeccion(2.5);
    setLimite("3");
    setCopiado(false);
  }

  // Copiar resultados
  async function copiar() {
    if (resultado === null) return;

    const texto =
      herramienta === "potencia"
        ? `PGTE - ${
            operacion === "corriente"
              ? "Corriente"
              : "Potencia activa"
          }: ${formato(resultadoPotencia.dato!)} ${
            operacion === "corriente" ? "A" : "W"
          }`
        : `PGTE - Caída de tensión: ${
            formato(resultadoCaida.dato!.caidaV)
          } V (${formato(
            resultadoCaida.dato!.porcentaje
          )} %)`;

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Selección de calculadora */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setHerramienta("potencia");
            setCopiado(false);
          }}
          className={`flex items-center justify-center gap-2
            rounded-xl border p-3 text-xs font-semibold
            transition sm:text-sm ${
              herramienta === "potencia"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
          <Zap size={18} />
          Potencia / Corriente
        </button>

        <button
          type="button"
          onClick={() => {
            setHerramienta("caida");
            setCopiado(false);
          }}
          className={`flex items-center justify-center gap-2
            rounded-xl border p-3 text-xs font-semibold
            transition sm:text-sm ${
              herramienta === "caida"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
          <Activity size={18} />
          Caída de tensión
        </button>
      </div>

      {/* Formulario */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <Calculator size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              {herramienta === "potencia"
                ? "Potencia y corriente"
                : "Caída de tensión"}
            </h2>
            <p className="text-xs text-slate-500">
              Cálculo automático
            </p>
          </div>
        </div>

        {/* Sistema eléctrico */}
        <div className="mb-4">
          <label htmlFor="sistema" className={etiqueta}>
            Tipo de sistema
          </label>

          <select
            id="sistema"
            className={campo}
            value={sistema}
            onChange={(e) =>
              cambiarSistema(e.target.value as Sistema)
            }
          >
            <option value="monofasico">Monofásico</option>
            <option value="trifasico">
              Trifásico equilibrado
            </option>
          </select>
        </div>

        {/* Operación */}
        {herramienta === "potencia" && (
          <div className="mb-4">
            <label htmlFor="operacion" className={etiqueta}>
              ¿Qué deseas calcular?
            </label>

            <select
              id="operacion"
              className={campo}
              value={operacion}
              onChange={(e) => {
                setOperacion(e.target.value as Operacion);
                setValor("");
                setCopiado(false);
              }}
            >
              <option value="corriente">
                Corriente (A)
              </option>
              <option value="potencia">
                Potencia activa (W)
              </option>
            </select>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tensión */}
          <div>
            <label htmlFor="tension" className={etiqueta}>
              Tensión (V)
            </label>

            <input
              id="tension"
              type="number"
              min="0.01"
              step="any"
              placeholder={
                sistema === "monofasico"
                  ? "Ej: 220"
                  : "Ej: 380"
              }
              className={campo}
              value={tension}
              onChange={(e) => {
                setTension(e.target.value);
                setCopiado(false);
              }}
            />
          </div>

          {herramienta === "potencia" ? (
            <div>
              <label htmlFor="valor" className={etiqueta}>
                {operacion === "corriente"
                  ? "Potencia activa (W)"
                  : "Corriente (A)"}
              </label>

              <input
                id="valor"
                type="number"
                min="0.01"
                step="any"
                placeholder={
                  operacion === "corriente"
                    ? "Ej: 3000"
                    : "Ej: 10"
                }
                className={campo}
                value={valor}
                onChange={(e) => {
                  setValor(e.target.value);
                  setCopiado(false);
                }}
              />
            </div>
          ) : (
            <>
              {/* Corriente */}
              <div>
                <label htmlFor="corriente" className={etiqueta}>
                  Corriente (A)
                </label>

                <input
                  id="corriente"
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="Ej: 10"
                  className={campo}
                  value={corriente}
                  onChange={(e) => {
                    setCorriente(e.target.value);
                    setCopiado(false);
                  }}
                />
              </div>

              {/* Longitud */}
              <div>
                <label htmlFor="longitud" className={etiqueta}>
                  Longitud de ida (m)
                </label>

                <input
                  id="longitud"
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="Ej: 20"
                  className={campo}
                  value={longitud}
                  onChange={(e) => {
                    setLongitud(e.target.value);
                    setCopiado(false);
                  }}
                />
              </div>

              {/* Sección */}
              <div>
                <label htmlFor="seccion" className={etiqueta}>
                  Sección de cobre (mm²)
                </label>

                <select
                  id="seccion"
                  className={campo}
                  value={seccion}
                  onChange={(e) => {
                    setSeccion(
                      Number(e.target.value) as Seccion
                    );
                    setCopiado(false);
                  }}
                >
                  {Object.keys(RESISTENCIAS_COBRE).map(
                    (s) => (
                      <option key={s} value={s}>
                        {s} mm²
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Límite de referencia */}
              <div>
                <label htmlFor="limite" className={etiqueta}>
                  Referencia de caída
                </label>

                <select
                  id="limite"
                  className={campo}
                  value={limite}
                  onChange={(e) =>
                    setLimite(e.target.value)
                  }
                >
                  <option value="3">
                    3 % - Alimentador
                  </option>
                  <option value="5">
                    5 % - Total
                  </option>
                </select>
              </div>
            </>
          )}

          {/* Factor de potencia */}
          <div>
            <label htmlFor="fp" className={etiqueta}>
              Factor de potencia (cos φ)
            </label>

            <input
              id="fp"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              placeholder="Ej: 0.9"
              className={campo}
              value={fp}
              onChange={(e) => {
                setFp(e.target.value);
                setCopiado(false);
              }}
            />
          </div>
        </div>

        {/* Resultado */}
        <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white">
          <p className="text-sm text-slate-300">
            Resultado
          </p>

          {error ? (
            <p
              role="alert"
              className="mt-2 text-sm text-amber-300"
            >
              {error}
            </p>
          ) : resultado === null ? (
            <p className="mt-2 text-sm text-slate-300">
              Ingresa los datos para realizar el cálculo.
            </p>
          ) : herramienta === "potencia" ? (
            <>
              <p className="mt-2 text-3xl font-bold">
                {formato(resultadoPotencia.dato!)}

                <span className="ml-2 text-lg text-blue-300">
                  {operacion === "corriente" ? "A" : "W"}
                </span>
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {sistema === "trifasico"
                  ? "Sistema trifásico equilibrado: tensión entre fases"
                  : "Sistema monofásico: tensión de alimentación"}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-3xl font-bold">
                {formato(
                  resultadoCaida.dato!.porcentaje
                )}

                <span className="ml-2 text-lg text-blue-300">
                  %
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Caída:{" "}
                {formato(resultadoCaida.dato!.caidaV)} V
              </p>

              <p className="text-sm text-slate-300">
                Tensión estimada:{" "}
                {formato(
                  resultadoCaida.dato!.tensionFinalV
                )}{" "}
                V
              </p>

              <p
                className={`mt-3 text-sm font-medium ${
                  resultadoCaida.dato!.porcentaje <=
                  Number(limite)
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {resultadoCaida.dato!.porcentaje <=
                Number(limite)
                  ? "Dentro de la referencia seleccionada"
                  : "Supera la referencia seleccionada"}
              </p>
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copiar}
            disabled={resultado === null}
            className="flex items-center gap-2 rounded-xl
              bg-blue-600 px-4 py-2.5 text-sm font-medium
              text-white transition hover:bg-blue-700
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copiado ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}

            {copiado
              ? "Copiado"
              : "Copiar resultado"}
          </button>

          <button
            type="button"
            onClick={limpiar}
            className="flex items-center gap-2 rounded-xl
              border border-slate-200 px-4 py-2.5
              text-sm font-medium text-slate-700
              transition hover:bg-slate-50"
          >
            <RotateCcw size={17} />
            Restablecer
          </button>
        </div>

        {/* Nota técnica */}
        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          {herramienta === "potencia"
            ? "Estimación de potencia activa y corriente en corriente alterna. No considera desequilibrio, armónicos ni rendimiento mecánico."
            : "Estimación resistiva a 20 °C para conductores de cobre. No considera reactancia, temperatura de servicio ni condiciones reales de instalación. No certifica cumplimiento SEC."}
        </p>
      </section>
    </div>
  );
}
