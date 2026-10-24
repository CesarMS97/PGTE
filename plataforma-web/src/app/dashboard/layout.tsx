export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Aquí puedes colocar luego tu barra de navegación o sidebar del dashboard */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}