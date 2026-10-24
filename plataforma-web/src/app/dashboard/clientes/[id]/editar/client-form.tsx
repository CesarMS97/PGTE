"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ClientFormProps {
  cliente: {
    id: string;
    nombre: string;
    rut: string | null;
    telefono: string | null;
    email: string | null;
    observaciones: string | null;
  };
  id: string;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function ClientForm({ cliente, id, action }: ClientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const resultado = await action(formData);
      if (resultado.success) {
        router.refresh(); // Limpia la caché del navegador
        router.push(`/dashboard/clientes/${id}`);
      } else {
        alert(resultado.error || "Ocurrió un error al actualizar");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
          Nombre o Razón Social <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          defaultValue={cliente.nombre}
          required
          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">RUT</label>
          <input
            type="text"
            name="rut"
            defaultValue={cliente.rut || ""}
            placeholder="Ej. 12.345.678-9"
            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Teléfono</label>
          <input
            type="text"
            name="telefono"
            defaultValue={cliente.telefono || ""}
            placeholder="Ej. +56912345678"
            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          defaultValue={cliente.email || ""}
          placeholder="contacto@empresa.cl"
          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Observaciones</label>
        <textarea
          name="observaciones"
          rows={4}
          defaultValue={cliente.observaciones || ""}
          placeholder="Notas adicionales..."
          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <Link
          href={`/dashboard/clientes/${id}`}
          className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}