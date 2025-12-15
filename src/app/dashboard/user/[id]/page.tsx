import { getUserById } from "@/services/userService";

interface Props {
  params: Promise<{ id: string }>; // <--- OJO: En Next.js 15 params es una Promesa
}

export default async function UserDetailPage({ params }: Props) {
  // 1. Desempaquetamos los parámetros de la URL (esperando la promesa)
  const { id } = await params;

  // 2. Usamos el ID para pedir los datos al servidor
  const user = await getUserById(id);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{user.name}</h1>
      <p className="text-gray-500 mb-6">@{user.name || 'sin_usuario'}</p>

      <div className="grid grid-cols-1 gap-4 border-t pt-4">
        <div>
          <strong className="block text-sm text-gray-700">Email:</strong>
          <span>{user.email}</span>
        </div>
        <div>
          <strong className="block text-sm text-gray-700">Empresa:</strong>
          <span>{user.company.name}</span>
        </div>
        <div>
          <strong className="block text-sm text-gray-700">Frase:</strong>
          <span className="italic text-gray-600">"{user.company.catchPhrase}"</span>
        </div>
      </div>
      
      {/* Botón para volver atrás (opcional pero útil) */}
      <a href="/dashboard" className="block mt-8 text-blue-600 hover:underline">
        ← Volver al Dashboard
      </a>
    </div>
  );
}