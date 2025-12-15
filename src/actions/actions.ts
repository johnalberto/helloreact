 'use server';

import { revalidatePath } from 'next/cache';

// 1. Definimos la estructura de la respuesta (Tu "ViewModel")
export type State = {
  status: 'success' | 'error' | null;
  message: string | null;
};

// 2. Modificamos la firma de la función
// IMPORTANTE: useFormState requiere que el primer argumento sea el estado anterior (prevState)
export async function createTask(prevState: State, formData: FormData): Promise<State> {
  
  const title = formData.get('title') as string;
  const priority = formData.get('priority') as string;

  // Simulamos una validación de Backend (como DataAnnotations en C#)
  if (!title || title.length < 3) {
    return { 
      status: 'error', 
      message: '❌ El título debe tener al menos 3 letras.' 
    };
  }

  try {
    // Simulamos la BD
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Guardado: ${title}`);
    
    revalidatePath('/dashboard'); // Ojo con la ruta correcta
    
    // Retornamos éxito
    return { 
      status: 'success', 
      message: '✅ ¡Tarea guardada correctamente!' 
    };

  } catch (error) {
    return { 
      status: 'error', 
      message: '❌ Error de conexión con la base de datos.' 
    };
  }
}