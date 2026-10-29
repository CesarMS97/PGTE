import { z } from "zod";

export const clienteSchema = z.object({
  empresa_id: z.string().uuid({ message: "El ID de la empresa es obligatorio y debe ser válido." }),
  
  nombre: z.string()
    .min(1, { message: "El nombre es obligatorio." })
    .max(150, { message: "El nombre no puede superar los 150 caracteres." }),
  
  rut: z.string()
    .max(12, { message: "El RUT no puede superar los 12 caracteres." })
    .optional()
    .nullable(),
  
  telefono: z.string()
    .max(20, { message: "El teléfono no puede superar los 20 caracteres." })
    .optional()
    .nullable(),
  
  email: z.string()
    .email({ message: "Debe ser un correo electrónico válido." })
    .max(150, { message: "El email es demasiado largo." })
    .optional()
    .nullable(),
    
  observaciones: z.string().optional().nullable(),
});

// Tipo inferido automáticamente para usar en formularios o componentes
export type ClienteInput = z.infer<typeof clienteSchema>;