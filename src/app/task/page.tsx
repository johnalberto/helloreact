import { prisma } from "@/lib/prisma";
import { AddTaskForm } from './AddTaskForm';
import DeleteButton from "@/components/DeleteButton";
import TaskCheckbox from "@/components/TaskCheckbox";
import Link from "next/link";
import TaskSearch from "@/components/TaskSearch";

interface Props {
  searchParams: Promise<{
    query?: string;
  }>;
}

export default async function TaskPage({ searchParams }: Props) {
  
  // 2. Esperamos a obtener los parámetros de la URL
  const { query } = await searchParams;

  // 3. Modificamos la consulta a la BD
  const tasks = await prisma.task.findMany({
    where: {
      // Si hay 'query', filtra por título. Si no, trae todo.
      title: {
        contains: query || "", // Filtra si el título contiene el texto
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="max-w-2xl mx-auto p-10">
      
      {/* Encabezado con Flexbox para alinear título y botón Home */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Tareas 🚀</h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          Ir al Dashboard &rarr;
        </Link>
      </div>
      
      <section className="mb-8">
        <AddTaskForm />
      </section>

      {/* 👇 4. Aquí colocamos la Barra de Búsqueda */}
      <TaskSearch />

      <div className="mt-8">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
            Lista de Tareas
            </h2>
            {/* Pequeño badge contador */}
            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
            </span>
        </div>
        
        <ul className="space-y-3">
          {tasks.map((task) => (
             // ... AQUÍ VA TU CÓDIGO DEL <li ...> QUE YA TIENES ...
             // (No lo copio todo para ahorrar espacio, mantén tu lógica de renderizado actual)
             <li 
              key={task.id} 
              className={`p-4 border rounded-lg shadow-sm flex justify-between items-center transition-all ${
                task.isCompleted ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200"
              }`}
            >
               {/* ... contenido del li (Checkbox, Textos, Botones) ... */}
               {/* ... COPIA TU CÓDIGO EXISTENTE AQUÍ ... */}
               
               {/* RECORDATORIO: Asegúrate de tener el botón de Editar y Eliminar aquí */}
               <div className="flex items-center gap-4">
                  {/* ... Parte Izquierda (Checkbox + Info) ... */}
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

                  {/* ... Parte Derecha (Link Editar + Botón Eliminar) ... */}
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
               {/* Mensaje dinámico dependiendo de si estás buscando o no */}
               {query ? (
                 <p className="text-gray-500">🔍 No encontramos tareas que coincidan con "<b>{query}</b>"</p>
               ) : (
                 <p className="text-gray-500">🎉 ¡No hay tareas pendientes!</p>
               )}
            </div>
          )}
        </ul>
      </div>
    </main>
  );
}