import { getTasksFromDB } from '@/services/taskService'; 
import { AddTaskForm } from './AddTaskForm'; // Asegúrate que la ruta sea correcta

export default async function TaskPage() {
  // 1. Obtenemos datos (Server-side)
  const tasks = await getTasksFromDB();

  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Gestión de Tareas</h1>
      
      {/* 2. Mostramos el Formulario */}
      <section className="mb-10">
        <AddTaskForm />
      </section>

      {/* 3. Mostramos la Lista */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Lista Actual</h2>
        
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic">No hay tareas pendientes.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">ID: {task.id}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full 
                  ${task.priority === 'Alta' ? 'bg-red-100 text-red-800' : 
                    task.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {task.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}