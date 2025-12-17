"use client"; // 👈 Obligatorio para usar useActionState

import { useActionState } from "react";
import { updateTask } from "@/actions/task-actions";
import Link from "next/link";

// Definimos qué datos necesita este formulario para pre-llenarse
interface TaskData {
  id: number;
  title: string;
  priority: string;
}

type State = {
  status: 'success' | 'error' | null;
  message: string | null;
};

export default function EditForm({ task }: { task: TaskData }) {


  const initialState: State = { message: null, status: null };
  
  const [state, dispatch, isPending] = useActionState(updateTask, initialState);

  return (
    <form action={dispatch} className="flex flex-col gap-5">
      {/* Input Oculto para enviar el ID a la Server Action */}
      <input type="hidden" name="id" value={task.id} />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
        <input
          type="text"
          name="title"
          defaultValue={task.title}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

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

      {/* Mensaje de Error (si falla la actualización) */}
      {state?.status === "error" && (
        <p className="text-red-500 text-sm font-medium">{state.message}</p>
      )}

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