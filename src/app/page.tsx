import Contador from "@/components/Counter";
import Link from "next/link"; // <--- Importar esto


 export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Bienvenido a Next.js 15</h1>
      <p>Este texto se renderiza en el servidor (Rápido ⚡)</p>
      
      {/* Aquí cargamos la interactividad */}
      <Contador/>
      <Contador/>
      {/* Nuevo enlace */}
      <Link 
        href="/about"
        className="mt-8 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Ir a Sobre Mí
      </Link>
    </main>
  );
}
