"use client"; // 👈 Obligatorio para usar onClick y hooks

import { deleteTask } from "@/actions/task-actions";
import { useTransition } from "react"; // Hook para manejar estados de carga sin formularios complejos

export default function DeleteButton({ taskId }: { taskId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // 1. Confirmación de seguridad
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta tarea?");
    if (!confirmed) return;

    // 2. Ejecutar la Server Action
    startTransition(async () => {
      await deleteTask(taskId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-sm px-3 py-1 rounded border transition-colors ${
        isPending 
          ? "bg-gray-100 text-gray-400 cursor-wait" 
          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white"
      }`}
    >
      {isPending ? "Borrando..." : "Eliminar"}
    </button>
  );
}