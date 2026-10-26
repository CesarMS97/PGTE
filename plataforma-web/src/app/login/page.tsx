
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            PGTE
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Plataforma de Gestión Técnica Eléctrica
          </p>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">
            Iniciar sesión
          </h2>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
