'use client'; 

import { useActionState, useEffect, useRef } from "react";
import { createTask } from '@/actions/task-actions';
import SubmitButton from '@/components/SubmitButton';
import { toast } from "sonner"; 
import { Category } from "@prisma/client";

const initialState = {
  status: null,
  message: null,
};

// 👇 Definimos que recibimos la lista de categorías
interface Props {
  categories: Category[];
}

export function AddTaskForm({ categories }: Props) {
  const [state, dispatch, isPending] = useActionState(createTask, initialState);
  
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === 'success') {
      toast.success(state.message);
      ref.current?.reset(); 
    } else if (state?.status === 'error') {
      toast.error(state.message);
    }
  }, [state]); 

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="font-bold mb-4 text-lg">Nueva Tarea</h3>

      <form ref={ref} action={dispatch} className="flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          
          {/* 1. Input Título */}
          <div className="flex flex-col gap-1 flex-grow">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">Título</label>
            <input 
              name="title"
              type="text" 
              placeholder="Ej. Fix bug #123" 
              className="border border-gray-300 p-2 rounded text-black"
            />
          </div>

          {/* 2. Select Prioridad */}
          <div className="flex flex-col gap-1">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">Prioridad</label>
            <select name="priority" className="border border-gray-300 p-2 rounded bg-white text-black">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* 👇 3. NUEVO: Select Categoría (Insertado aquí) */}
          <div className="flex flex-col gap-1">
            <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">Categoría</label>
            <select 
                name="categoryId" 
                className="border border-gray-300 p-2 rounded bg-white text-black min-w-[120px]"
                defaultValue=""
            >
                <option value="" disabled>Elegir...</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
          </div>

          {/* 4. Botón Submit */}
          <SubmitButton label="Crear Tarea" loadingLabel="Guardando..." />
        </div>

      </form>
    </div>
  );
}