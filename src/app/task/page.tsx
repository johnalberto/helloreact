import { prisma } from "@/lib/prisma";
import { AddTaskForm } from './AddTaskForm';
import DeleteButton from "@/components/DeleteButton";
import TaskCheckbox from "@/components/TaskCheckbox";
import Link from "next/link";
import TaskSearch from "@/components/TaskSearch";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server"; // 👈 1. NUEVO IMPORT
import { redirect } from "next/navigation";  // 👈 1. NUEVO IMPORT

interface Props {
  searchParams: Promise<{
    query?: string;
  }>;
}

export default async function TaskPage({ searchParams }: Props) {
  // 👇 2. OBTENER EL USUARIO (Seguridad)
  const { userId } = await auth();

  // Si alguien intenta entrar a la fuerza sin loguearse, lo sacamos
  if (!userId) {
    redirect("/"); 
  }

  const { query } = await searchParams;

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId, // 👈 3. FILTRO CLAVE: Solo mis tareas
      title: {
        contains: query || "",
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    // ... (El resto de tu JSX queda EXACTAMENTE IGUAL, no hace falta tocarlo)
    <main className="max-w-2xl mx-auto p-10">
      {/* ... header, userbutton, forms, etc ... */}
       <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold">Mis Tareas 🚀</h1>
           <p className="text-gray-500 text-sm">Gestiona tu día a día</p>
        </div>
        <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/"/>
        </div>
      </div>
      
      {/* ... resto del código ... */}
      <section className="mb-8">
        <AddTaskForm />
      </section>
      
      <TaskSearch />
      
      <div className="mt-8">
        {/* ... lista de tareas ... */}
        {/* Aquí pones tu código de la lista y el .map tal cual estaba */}
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
                         <span className={`text-xs px-2 py-0.5 w-fit rounded-full font-medium mt-1 ${
                             task.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                             task.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-green-100 text-green-700'
                         }`}>
                             {task.priority}
                         </span>
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
                  <p className="text-gray-500">🎉 No tienes tareas pendientes (o acabas de crear tu cuenta)</p>
             </div>
           )}
        </ul>
      </div>
    </main>
  );
}