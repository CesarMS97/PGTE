import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClienteForm } from '@/components/clientes/ClientForm';
import { crearCliente } from '@/services/clientes.service';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export default async function NuevoClientePage() {
  
  async function handleCreateCliente(formDataObject: {
    nombre: string;
    rut?: string;
    telefono?: string;
    email?: string;
    observaciones?: string;
  }) {
    'use server';

    // 1. Instanciamos el cliente de Supabase para servidor
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("No hay una sesión activa o el usuario no está autenticado.");
    }

    // 2. Obtenemos el empresa_id asociado al usuario actual
    let empresaId = user.user_metadata?.empresa_id;

    if (!empresaId) {
      const empresaDefault = await prisma.empresas.findFirst();
      if (!empresaDefault) {
        throw new Error("No se encontró ninguna empresa registrada en el sistema.");
      }
      empresaId = empresaDefault.id;
    }

    // 3. Preparamos el payload completo
    const payloadCompleto = {
      ...formDataObject,
      empresa_id: empresaId,
    };

    // 4. Invocamos el servicio de creación
    const resultado = await crearCliente(payloadCompleto);

    if (!resultado.success) {
      throw new Error(resultado.error || "Error al registrar el cliente en la base de datos.");
    }

    // 5. Redireccionamos (debe ejecutarse fuera de bloques try/catch)
    redirect('/dashboard/clientes');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div>
        <Link 
          href="/dashboard/clientes" 
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Volver a Clientes
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Registrar Nuevo Cliente
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Ingresa la información del cliente para vincularlo a tu sesión de trabajo.
        </p>
      </div>

      <ClienteForm isEditing={false} onSubmitAction={handleCreateCliente} />
    </div>
  );
}