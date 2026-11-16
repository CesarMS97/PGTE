import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Regístrate y comienza a organizar tus trabajos eléctricos con PGTE."
    >
      <RegisterForm />
    </AuthLayout>
  );
}