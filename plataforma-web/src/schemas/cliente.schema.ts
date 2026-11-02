import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string()
    .min(1, { message: "El nombre es obligatorio." })
    .max(150, { message: "El nombre no puede superar los 150 caracteres." }),
  
  rut: z.string()
    .max(12, { message: "El RUT no puede superar los 12 caracteres." })
    .optional()
    .nullable()
    .or(z.literal("")),
  
  telefono: z.string()
    .max(20, { message: "El teléfono no puede superar los 20 caracteres." })
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

// Tipo inferido automáticamente para usar en formularios o componentes
export type ClienteInput = z.infer<typeof clienteSchema>;