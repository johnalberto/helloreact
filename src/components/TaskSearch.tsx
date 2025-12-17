"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // 👈 1. Importamos el hook

export default function TaskSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // 2. Envolvemos nuestra lógica en el hook de Debounce
  // "Espera 300ms después de que deje de escribir para ejecutar esto"
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`🔎 Buscando: ${term}`); // Para que lo veas en la consola
    
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300); // 👈 Tiempo de espera (300ms es el estándar de la industria)

  return (
    <div className="mb-6">
      <label className="sr-only">Buscar tarea</label>
      <input
        type="text"
        placeholder="🔍 Buscar tareas..."
        // 3. Ejecutamos la función "frenada"
        onChange={(e) => handleSearch(e.target.value)}
        
        // OJO: defaultValue es clave aquí. No usamos 'value' controlado
        // porque queremos que el input sea ágil, aunque la URL se actualice lento.
        defaultValue={searchParams.get("query")?.toString()}
        
        className="w-full p-3 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow hover:shadow-sm"
      />
    </div>
  );
}