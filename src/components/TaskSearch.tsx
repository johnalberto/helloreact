"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TaskSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Función que se ejecuta cada vez que escribes
  const handleSearch = (term: string) => {
    // 1. Clonamos los parámetros actuales de la URL
    const params = new URLSearchParams(searchParams);

    // 2. Si hay texto, lo seteamos. Si no, borramos el param.
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // 3. Reemplazamos la URL actual sin recargar la página
    // Ejemplo: /task  ->  /task?query=hola
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <label className="sr-only">Buscar tarea</label>
      <input
        type="text"
        placeholder="🔍 Buscar tareas..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()} // Mantiene el texto si refrescas
        className="w-full p-3 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}