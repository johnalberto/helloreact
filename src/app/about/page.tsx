// src/app/about/page.tsx
import Link from "next/link";


export default function AboutPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Sobre Mí</h1>
      <p className="mb-8 text-gray-600">
        Soy un desarrollador Full Stack aprendiendo Next.js con arquitectura profesional.
      </p>

      {/* El componente Link es vital para no recargar la página completa */}
      <Link 
        href="/" 
        className="text-blue-500 hover:underline"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}