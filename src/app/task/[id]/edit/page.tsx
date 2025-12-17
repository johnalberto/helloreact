import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditForm from "./EditForm"; // 👈 Importamos el componente cliente

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({ params }: Props) {
  // 1. Recuperar ID (Promesa)
  const { id } = await params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) redirect("/task");

  // 2. Buscar Datos en BD
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) redirect("/task");

  // 3. Renderizar (Pasamos los datos al componente Cliente)
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Editar Tarea <span className="text-blue-600">#{task.id}</span>
      </h1>
      
      {/* Aquí vive el formulario interactivo 👇 */}
      <EditForm task={task} />
    </div>
  );
}