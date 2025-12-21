"use client";

import { deleteTask } from "@/actions/task-actions";
import { toast } from "sonner"; 

export default function DeleteButton({ taskId }: { taskId: number }) {
  
  const handleDelete = async () => {
    // 1. 👇 RECUPERAMOS LA VENTANA DE DIÁLOGO
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.");

    // Si el usuario dice "Cancelar", detenemos todo aquí.
    if (!confirmacion) return;

    // 2. Si dijo "Aceptar", procedemos con el borrado y la notificación
    const promise = deleteTask(taskId);

    toast.promise(promise, {
      loading: 'Eliminando tarea...',
      success: 'Tarea eliminada correctamente 🗑️',
      error: 'Hubo un error al eliminar',
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
    >
      Eliminar
    </button>
  );
}