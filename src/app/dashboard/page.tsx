// src/app/dashboard/page.tsx
//import { User } from "@/types/users"; // <--- Importación limpia
import { getUsers } from "@/services/userService";
import Link from "next/link"; // <--- No olvides importar esto
import UserForm from "@/components/UserForm"; // <--- Importar

export default async function DashboardPage() {

   // 1. Llamada directa al servidor (Sin useEffect!)
  const users = await getUsers();

  return (
    <div>
     
     <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>
      <UserForm />
      <h1 className="text-3xl font-bold mb-6">Lista de Usuarios (Desde API)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (

          <Link 
            key={user.id} 
            href={`/dashboard/user/${user.id}`} // <--- URL Dinámica
            className="block hover:no-underline" // Estilo para quitar subrayado
          >
          <div key={user.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{user.email}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {user.company.name}
              </span>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
  
}

