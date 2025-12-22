import { prisma } from "@/lib/prisma";
import { AddTaskForm } from './AddTaskForm';
import DeleteButton from "@/components/DeleteButton";
import TaskCheckbox from "@/components/TaskCheckbox";
import Link from "next/link";
import TaskSearch from "@/components/TaskSearch";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation"; 

interface Props {
  searchParams: Promise<{
    query?: string;
    categoryId?: string; // 👈 1. CORREGIDO: Usamos categoryId para coincidir con la URL
  }>;
}

export default async function TaskPage({ searchParams }: Props) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/"); 
  }

  // Buscar categorías
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: userId }, 
        { userId: null }, 
      ]
    }
  });

  // 👇 2. LEEMOS 'categoryId' (antes era 'category')
  const { query, categoryId } = await searchParams;

  // Buscar tareas
  const tasks = await prisma.task.findMany({
    where: {
      userId: userId, 
      title: {
        contains: query || "",
      },
      // 👇 3. FILTRO CORRECTO
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    },
    include: {
      category: true 
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="max-w-2xl mx-auto p-10">
      
       <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold">Mis Tareas 🚀</h1>
           <p className="text-gray-500 text-sm">Gestiona tu día a día</p>
        </div>
        <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/"/>
        </div>
      </div>
      
      <section className="mb-8">
        <AddTaskForm categories={categories} />
      </section>
      
      <TaskSearch />
      
      <div className="mt-8">
        
        {/* 👇 4. BLOQUE DE FILTRO VISIBLE */}
        {/* Solo se muestra si 'categoryId' tiene valor (es decir, si hiciste clic en una etiqueta) */}
        {categoryId && (
            <div className="flex items-center gap-2 mb-4 bg-blue-50 p-2 rounded-md text-sm text-blue-700 border border-blue-100">
                <span>🔍 Estás viendo solo: <b>Categoría seleccionada</b></span>
                <Link href="/task" className="font-bold hover:underline ml-auto">
                    Quitar filtro ✕
                </Link>
            </div>
        )}
        
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Lista de Tareas</h2>
             <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
            </span>
        </div>

        <ul className="space-y-3">
             {tasks.map((task) => (
               <li 
               key={task.id} 
               className={`p-4 border rounded-lg shadow-sm flex justify-between items-center transition-all ${
                 task.isCompleted ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"
               }`}
             >
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-4">
                     <TaskCheckbox taskId={task.id} isCompleted={task.isCompleted} />
                     <div className="flex flex-col">
                         <p className={`font-medium text-lg ${task.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
                             {task.title}
                         </p>
                         
                         <div className="flex gap-2 mt-1">
                             <span className={`text-xs px-2 py-0.5 w-fit rounded-full font-medium ${
                                 task.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                                 task.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                                 'bg-green-100 text-green-700'
                             }`}>
                                 {task.priority}
                             </span>

                             {task.category && (
                               <Link 
                                 href={`/task?categoryId=${task.category.id}`} 
                                 className="text-xs px-2 py-0.5 w-fit rounded-full font-medium text-white hover:opacity-80 transition-opacity"
                                 style={{ backgroundColor: task.category.color }}
                               >
                                 {task.category.name}
                               </Link>
                             )}
                         </div>

                     </div>
                   </div>
  
                   <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 hidden sm:block mr-2">
                         {task.createdAt.toLocaleDateString()}
                      </span>
                      <Link 
                         href={`/task/${task.id}/edit`} 
                         className="text-sm px-3 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                         Editar
                      </Link>
                      <DeleteButton taskId={task.id} />
                   </div>
                </div>
             </li>
           ))}
           {tasks.length === 0 && (
             <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">
                    {categoryId 
                        ? "No hay tareas en esta categoría. ¡Prueba otra!" 
                        : "🎉 No tienes tareas pendientes"
                    }
                  </p>
             </div>
           )}
        </ul>
      </div>
    </main>
  );
}