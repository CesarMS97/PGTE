import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard PGTE
          </h1>
          <p className="mt-2 text-slate-600">
            Bienvenido a la Plataforma de Gestión
            Técnica Eléctrica.
          </p>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}
