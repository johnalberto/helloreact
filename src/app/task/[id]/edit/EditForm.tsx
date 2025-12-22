"use client"; 

import { useActionState, useEffect } from "react"; // 👈 Agregamos useEffect
import { updateTask } from "@/actions/task-actions";
import Link from "next/link";
import { Category } from "@prisma/client";
import { toast } from "sonner"; // 👈 Importamos toast

interface TaskData {
  id: number;
  title: string;
  priority: string;
  categoryId: number | null;
}

interface Props {
    task: TaskData;
    categories: Category[];
}

type State = {
  status: 'success' | 'error' | null;
  message: string | null;
};

export default function EditForm({ task, categories }: Props) {

  const initialState: State = { message: null, status: null };
  
  const [state, dispatch, isPending] = useActionState(updateTask, initialState);

  // 👇 1. EFECTO: Escuchar cambios para mostrar la notificación
  useEffect(() => {
    if (state?.status === 'success') {
      toast.success(state.message);
    } else if (state?.status === 'error') {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={task.id} />

      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
        <input
          type="text"
          name="title"
          defaultValue={task.title}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Prioridad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Prioridad</label>
        <select
          name="priority"
          defaultValue={task.priority}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
      </div>

      {/* 👇 2. NUEVO: Selector de Categoría */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
        <select
          name="categoryId"
          // Si tiene categoría la pone, si es null pone "" (Sin categoría)
          defaultValue={task.categoryId || ""} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-4 pt-2">
        <Link
          href="/task"
          className="flex-1 px-4 py-2 text-center bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </Link>
        
        <button
          type="submit"
          disabled={isPending}
          className={`flex-1 px-4 py-2 text-white font-medium rounded-md shadow-sm transition-colors ${
            isPending ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}