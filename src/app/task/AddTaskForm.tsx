'use client'; // 1. OBLIGATORIO: Ahora usamos hooks (useRef)

import { useFormState } from 'react-dom'; // 👈 El hook mágico
import { useRef, useEffect } from 'react';
import { createTask } from '@/actions/actions'; // Importamos la función del servidor
import SubmitButton from '@/components/SubmitButton';

// Definimos el estado inicial (antes de enviar nada)
const initialState = {
  status: null,
  message: null,
};

export function AddTaskForm() {
  // CONFIGURACIÓN DEL HOOK:
  // [state]: Contiene lo que devolvió el servidor (mensaje y status)
  // [dispatch]: Es la nueva función que usaremos en el 'action' del form
  const [state, dispatch] = useFormState(createTask, initialState);
  
  const ref = useRef<HTMLFormElement>(null);

  // EFECTO SECUNDARIO:
  // Queremos limpiar el form SOLO si fue éxito.
  // useEffect "vigila" la variable 'state'. Si cambia, ejecuta el código.
  useEffect(() => {
    if (state?.status === 'success') {
      ref.current?.reset(); // Limpiamos solo si salió bien
    }
  }, [state]); // <- Dependencia: se ejecuta cuando 'state' cambia

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="font-bold mb-4 text-lg">Nueva Tarea</h3>

      {/* action={dispatch} conecta el form con el hook useFormState */}
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

          <SubmitButton />
        </div>

        {/* MOSTRAR EL MENSAJE DEL SERVIDOR */}
        {state?.message && (
          <p aria-live="polite" className={`text-sm font-medium ${
            state.status === 'error' ? 'text-red-600' : 'text-green-600'
          }`}>
            {state.message}
          </p>
        )}

      </form>
    </div>
  );
}