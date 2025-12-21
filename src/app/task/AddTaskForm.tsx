'use client'; 

import { useActionState, useEffect, useRef } from "react";
import { createTask } from '@/actions/task-actions';
import SubmitButton from '@/components/SubmitButton';
import { toast } from "sonner"; // ✅ Importamos toast

const initialState = {
  status: null,
  message: null,
};

export function AddTaskForm() {
  const [state, dispatch, isPending] = useActionState(createTask, initialState);
  
  const ref = useRef<HTMLFormElement>(null);

  // 👇 AQUÍ ESTÁ LA MODIFICACIÓN CLAVE
  useEffect(() => {
    if (state?.status === 'success') {
      // 1. Mostrar notificación de éxito (Verde)
      toast.success(state.message);
      // 2. Limpiar el formulario
      ref.current?.reset(); 
    } else if (state?.status === 'error') {
      // 3. Mostrar notificación de error (Rojo)
      toast.error(state.message);
    }
  }, [state]); 

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="font-bold mb-4 text-lg">Nueva Tarea</h3>

      <form ref={ref} action={dispatch} className="flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex flex-col gap-1 flex-grow">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">Título</label>
            <input 
              name="title"
              type="text" 
              placeholder="Ej. Fix bug #123" 
              className="border border-gray-300 p-2 rounded text-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">Prioridad</label>
            <select name="priority" className="border border-gray-300 p-2 rounded bg-white text-black">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <SubmitButton label="Crear Juanchito" loadingLabel="Guardando..." />
        </div>

        {/* ❌ ELIMINADO: Ya no necesitamos mostrar el mensaje en texto plano aquí abajo
           porque el 'toast' se encargará de mostrarlo flotando.
           El código queda mucho más limpio.
        */}

      </form>
    </div>
  );
}