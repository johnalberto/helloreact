'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma'; // 👈 Importamos tu instancia singleton
import { redirect } from 'next/navigation';

export type State = {
  status: 'success' | 'error' | null;
  message: string | null;
};

export async function createTask(prevState: State, formData: FormData): Promise<State> {
  // 1. Validaciones (igual que antes)
  const title = formData.get('title')?.toString().trim();
  const priority = formData.get('priority')?.toString();

  if (!title || title.length < 3) {
    return { status: 'error', message: '❌ El título debe tener mín. 3 letras.' };
  }

  // 2. Guardar en Base de Datos (SQLite vía Prisma)
  try {
    await prisma.task.create({
      data: {
        title: title,
        priority: priority || 'Media', // Valor por defecto si falla
      },
    });

    // 3. Revalidar la caché
    // Esto es CLAVE: Le dice a Next.js "Borra la caché de /task para ver los datos nuevos"
    revalidatePath('/task'); 

    return { 
      status: 'success', 
      message: '✅ Tarea guardada en la base de datos' 
    };

  } catch (error) {
    console.error(error);
    return { 
      status: 'error', 
      message: '❌ Error al guardar en la base de datos' 
    };
  }
}

export async function deleteTask(taskId: number) {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    // ¡Importante! Avisar a Next.js que la lista cambió
    revalidatePath('/task');
    
    return { status: 'success', message: 'Tarea eliminada' };
  } catch (error) {
    return { status: 'error', message: 'Error al eliminar la tarea' };
  }
}

export async function toggleTask(taskId: number, isCompleted: boolean) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: isCompleted }, // Actualizamos el campo
    });

    revalidatePath('/task'); // Refrescamos la UI
    return { status: 'success', message: 'Estado actualizado' };
  } catch (error) {
    return { status: 'error', message: 'Error al actualizar' };
  }
}

// src/actions/task-actions.ts

// ... tus otras importaciones ...

export async function updateTask(prevState: State, formData: FormData): Promise<State> {
  // 1. Recuperamos el ID que pusimos en el input hidden
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const priority = formData.get("priority")?.toString();

  if (!id) {
    return { status: "error", message: "❌ ID de tarea no encontrado." };
  }

  if (!title || title.length < 3) {
    return { status: "error", message: "❌ El título debe tener mín. 3 letras." };
  }

  try {
    // 2. Actualizamos en Prisma
    await prisma.task.update({
      where: { id: parseInt(id) }, // Convertimos ID a número
      data: {
        title: title,
        priority: priority || "Media",
      },
    });

    // 3. Revalidamos la lista principal
    revalidatePath("/task");

  } catch (error) {
    return { status: "error", message: "❌ Error al actualizar la tarea." };
  }

  // 4. Redirigimos al usuario a la lista (FUERA del try/catch para evitar conflictos)
  redirect("/task");
}