export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-gray-500">Cargando datos del servidor...</span>
    </div>
  );
}