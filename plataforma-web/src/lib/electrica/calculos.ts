
export type Sistema = "monofasico" | "trifasico";

function validarPositivo(valor: number, nombre: string) {
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error(`${nombre} debe ser mayor que cero.`);
  }
}

function validarFP(fp: number) {
  if (!Number.isFinite(fp) || fp <= 0 || fp > 1) {
    throw new Error("El factor de potencia debe estar entre 0 y 1.");
  }
}

export function calcularCorriente(
  potenciaW: number,
  tensionV: number,
  fp: number,
  sistema: Sistema
) {
  validarPositivo(potenciaW, "La potencia");
  validarPositivo(tensionV, "La tensión");
  validarFP(fp);

  const factor = sistema === "trifasico" ? Math.sqrt(3) : 1;

  return potenciaW / (factor * tensionV * fp);
}

export function calcularPotencia(
  corrienteA: number,
  tensionV: number,
  fp: number,
  sistema: Sistema
) {
  validarPositivo(corrienteA, "La corriente");
  validarPositivo(tensionV, "La tensión");
  validarFP(fp);

  const factor = sistema === "trifasico" ? Math.sqrt(3) : 1;

  return factor * tensionV * corrienteA * fp;
}

// Resistencia máxima de referencia en Ω/km, a 20 °C.
// Cobre, categoría concéntrico/comprimido/compactado,
// tabla 4.1 del pliego SEC RIC N°04.
export const RESISTENCIAS_COBRE = {
  1.5: 12.1,
  2.5: 7.41,
  4: 4.61,
  6: 3.08,
  10: 1.83,
  16: 1.15,
  25: 0.73,
  35: 0.52,
  50: 0.39,
  70: 0.27,
  95: 0.19,
} as const;

export type Seccion = keyof typeof RESISTENCIAS_COBRE;

export function calcularCaidaTension(
  tensionV: number,
  corrienteA: number,
  longitudM: number,
  seccion: Seccion,
  fp: number,
  sistema: Sistema
) {
  validarPositivo(tensionV, "La tensión");
  validarPositivo(corrienteA, "La corriente");
  validarPositivo(longitudM, "La longitud");
  validarFP(fp);

  const resistenciaKm = RESISTENCIAS_COBRE[seccion];

  if (resistenciaKm === undefined) {
    throw new Error("Sección de conductor no soportada.");
  }

  const resistenciaM = resistenciaKm / 1000;
  const factor = sistema === "trifasico" ? Math.sqrt(3) : 2;

  // Aproximación resistiva, sin reactancia.
  const caidaV =
    factor * longitudM * corrienteA * resistenciaM * fp;

  const porcentaje = (caidaV / tensionV) * 100;

  return {
    caidaV,
    porcentaje,
    tensionFinalV: tensionV - caidaV,
  };
}
