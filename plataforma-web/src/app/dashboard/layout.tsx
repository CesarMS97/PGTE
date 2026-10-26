import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Menú de navegación lateral fijo */}
      <DashboardSidebar />

      {/* Contenido principal de cada módulo */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}