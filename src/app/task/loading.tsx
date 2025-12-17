export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto p-10">
      
      {/* 1. Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* 2. Formulario Skeleton (Caja grande) */}
      <div className="h-64 w-full bg-gray-100 rounded-lg animate-pulse mb-8" />

      {/* 3. Buscador Skeleton */}
      <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-8" />

      {/* 4. Lista de Tareas Skeleton */}
      <div className="mt-8">
        <div className="flex justify-between items-end mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        <div className="space-y-3">
          {/* Generamos 3 cajas grises para simular tareas */}
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="p-4 border border-gray-100 rounded-lg shadow-sm flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-4 w-full">
                {/* Cuadrado del Checkbox */}
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                
                {/* Líneas de texto */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                   <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                   <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Botón borrar */}
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}