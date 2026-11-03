import { z } from "zod";

// Función para normalizar y validar matemáticamente el RUT chileno (Módulo 11)
function validarYFormatearRut(rutInput: string): { valido: boolean; rutFormateado?: string } {
  if (!rutInput) return { valido: false };
  
  // 1. Limpiar puntos y espacios
  let valor = rutInput.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
  
  // 2. Si no tiene guion pero tiene largo suficiente, intentar agregarlo automáticamente (ej: 123456785 -> 12345678-5)
  if (!valor.includes("-") && valor.length > 1) {
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);
    valor = `${cuerpo}-${dv}`;
  }
  
  // 3. Validar estructura final (cuerpo de 1 a 8 dígitos, un guion, y DV numérico o K)
  const partes = valor.match(/^(\d{1,8})-([\dK])$/);
  if (!partes) return { valido: false };

  const cuerpo = partes[1];
  const dvIngresado = partes[2];

  // Cálculo del Módulo 11
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalculadoNum = 11 - resto;

  let dvCalculado = "";
  if (dvCalculadoNum === 11) {
    dvCalculado = "0";
  } else if (dvCalculadoNum === 10) {
    dvCalculado = "K";
  } else {
    dvCalculado = dvCalculadoNum.toString();
  }

  if (dvCalculado === dvIngresado) {
    return { valido: true, rutFormateado: valor };
  }

  return { valido: false };
}

// Función para validar que el teléfono sea real (ej: móviles chilenos con o sin +56)
function validarTelefonoReal(telefono: string): boolean {
  if (!telefono) return false;
  
  // Limpiar espacios y guiones para contar dígitos limpios
  const limpio = telefono.replace(/[\s\-]/g, "");

  // Patrones válidos comunes:
  // - Celular chileno con código país: +569XXXXXXXX (11 o 12 caracteres en total)
  // - Celular chileno sin código país: 9XXXXXXXX (9 dígitos)
  // - Teléfono fijo chileno con código de área (ej: 22XXXXXXX o +5622XXXXXXX)
  const regexTelefonoValido = /^(\+?56)?(9\d{8}|[2-9]\d{7,8})$/;

  return regexTelefonoValido.test(limpio);
}

export const clienteSchema = z.object({
  nombre: z.string()
    .min(1, { message: "El nombre es obligatorio." })
    .max(150, { message: "El nombre no puede superar los 150 caracteres." }),
  
  rut: z.string()
    .max(12, { message: "El RUT no puede superar los 12 caracteres." })
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      // Intenta formatear y estandarizar automáticamente
      const resultado = validarYFormatearRut(val);
      return resultado.rutFormateado || val;
    })
    .refine((val) => {
      if (!val) return true; // Si es nulo pasa (es opcional)
      const resultado = validarYFormatearRut(val);
      return resultado.valido;
    }, {
      message: "El RUT ingresado no es válido o el dígito verificador es incorrecto.",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
  
  telefono: z.string()
    .max(20, { message: "El teléfono no puede superar los 20 caracteres." })
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      return validarTelefonoReal(val);
    }, {
      message: "Ingresa un número de teléfono real válido (ej: +56912345678 o 912345678).",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
  
  email: z.string()
    .email({ message: "Debe ser un correo electrónico válido." })
    .max(150, { message: "El email es demasiado largo." })
    .optional()
    .nullable()
    .or(z.literal("")),
    
  observaciones: z.string()
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type ClienteInput = z.infer<typeof clienteSchema>;