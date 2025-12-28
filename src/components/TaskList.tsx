"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Category } from "@prisma/client";
import Link from "next/link";
import TaskCheckbox from "./TaskCheckbox";
import DeleteButton from "./DeleteButton";
import { updateTaskOrder } from "@/actions/task-actions"; // ✅ Importamos la acción

type TaskWithCategory = Task & { category: Category | null };

interface Props {
  initialTasks: TaskWithCategory[];
}

// 👇 COMPONENTE PARA CADA ITEM ARRASTRABLE
function SortableItem({ task }: { task: TaskWithCategory }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white border-gray-200 touch-none mb-3`}
    >
      <div className="flex items-center gap-4">
        {/* Aislamos eventos para que el checkbox funcione */}
        <div onPointerDown={(e) => e.stopPropagation()}>
             <TaskCheckbox taskId={task.id} isCompleted={task.isCompleted} />
        </div>
        
        <div className="flex flex-col">
          <p className={`font-medium text-lg ${task.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.title}
          </p>
          <div className="flex gap-2 mt-1">
             <span className="text-xs px-2 py-0.5 w-fit rounded-full bg-gray-100 text-gray-600 font-medium">
                {task.priority}
             </span>
             {task.category && (
                <span 
                  className="text-xs px-2 py-0.5 w-fit rounded-full font-medium text-white"
                  style={{ backgroundColor: task.category.color }}
                >
                  {task.category.name}
                </span>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         {/* Aislamos eventos para que los botones funcionen */}
         <div onPointerDown={(e) => e.stopPropagation()} className="flex gap-2">
            <Link href={`/task/${task.id}/edit`} className="text-sm text-indigo-600 hover:underline">
                Editar
            </Link>
            <DeleteButton taskId={task.id} />
         </div>
         <span className="text-gray-300 cursor-grab text-xl">≡</span>
      </div>
    </li>
  );
}

// 👇 COMPONENTE PRINCIPAL
export default function TaskList({ initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);

  // Sincronizar estado si las props cambian (útil al filtrar/recargar)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 👇 LÓGICA DE REORDENAMIENTO
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // 1. Buscamos los índices en el estado actual
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over?.id);
      
      // 2. Calculamos el nuevo array ordenado
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      
      // 3. Actualizamos la vista inmediatamente (Optimistic UI)
      setTasks(newOrder);
      
      // 4. Guardamos en la Base de Datos
      try {
          await updateTaskOrder(newOrder);
          console.log("✅ Orden guardado en BD");
      } catch (error) {
          console.error("❌ Error guardando orden", error);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <SortableItem key={task.id} task={task} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}