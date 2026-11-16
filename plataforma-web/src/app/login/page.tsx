import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      description="Ingresa a tu cuenta para gestionar tus trabajos eléctricos."
    >
      <Suspense
        fallback={
          <p className="py-6 text-center text-sm text-slate-500">
            Cargando formulario...
          </p>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}