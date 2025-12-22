import { prisma } from "@/lib/prisma";
import { AddTaskForm } from './AddTaskForm';
import TaskSearch from "@/components/TaskSearch";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation"; 
import TaskList from "@/components/TaskList"; // ✅ Usamos el componente nuevo
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
  }>;
}

export default async function TaskPage({ searchParams }: Props) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/"); 
  }

  // 1. Buscar categorías
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: userId }, 
        { userId: null }, 
      ]
    }
  });

  const { query, categoryId } = await searchParams;

  // 2. Buscar tareas
  const tasks = await prisma.task.findMany({
    where: {
      userId: userId, 
      title: {
        contains: query || "",
      },
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    },
    include: {
      category: true 
    },
    // 👇 AJUSTE IMPORTANTE: 'asc' funciona mejor para ordenar posiciones (0, 1, 2...)
    orderBy: [
      { order: 'asc' }, 
      { createdAt: 'desc' }
    ]
  });

  return (
    <main className="max-w-2xl mx-auto p-10">
      
       {/* Header */}
       <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold">Mis Tareas 🚀</h1>
           <p className="text-gray-500 text-sm">Gestiona tu día a día</p>
        </div>
        <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/"/>
        </div>
      </div>
      
      {/* Formulario */}
      <section className="mb-8">
        <AddTaskForm categories={categories} />
      </section>
      
      {/* Buscador */}
      <TaskSearch />
      
      <div className="mt-8">
        
        {/* Banner de Filtro Activo */}
        {categoryId && (
            <div className="flex items-center gap-2 mb-4 bg-blue-50 p-2 rounded-md text-sm text-blue-700 border border-blue-100">
                <span>🔍 Estás viendo solo: <b>Categoría seleccionada</b></span>
                <Link href="/task" className="font-bold hover:underline ml-auto">
                    Quitar filtro ✕
                </Link>
            </div>
        )}
        
        {/* Contador */}
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Lista de Tareas</h2>
             <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
            </span>
        </div>

        {/* 👇 AQUÍ ESTÁ EL CAMBIO PRINCIPAL */}
        {/* En lugar de todo el <ul> viejo, usamos el componente TaskList */}
        
        {tasks.length > 0 ? (
           <TaskList initialTasks={tasks} />
        ) : (
           <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">
                  {categoryId 
                      ? "No hay tareas en esta categoría. ¡Prueba otra!" 
                      : "🎉 No tienes tareas pendientes"
                  }
                </p>
           </div>
        )}

      </div>
    </main>
  );
}