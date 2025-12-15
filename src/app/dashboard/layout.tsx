// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* --- SIDEBAR IZQUIERDA --- */}
      <aside className="w-64 bg-slate-800 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Panel Admin</h2>
        
        <nav className="flex flex-col gap-4">
          <div className="hover:bg-slate-700 p-2 rounded cursor-pointer">
            📊 Resumen
          </div>
          <div className="hover:bg-slate-700 p-2 rounded cursor-pointer">
            👥 Usuarios
          </div>
          <div className="hover:bg-slate-700 p-2 rounded cursor-pointer">
            ⚙️ Configuración
          </div>
        </nav>
      </aside>

      {/* --- ÁREA DE CONTENIDO (A la derecha) --- */}
      <div className="flex-1 bg-slate-100 p-8 text-black">
        {children}
      </div>
    </div>
  );
}