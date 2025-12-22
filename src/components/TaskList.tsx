"use client";

import { useState } from "react";
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
import { Task, Category } from "@prisma/client"; // Tipos de Prisma
import Link from "next/link";
import TaskCheckbox from "./TaskCheckbox";
import DeleteButton from "./DeleteButton";

// 1. Extendemos el tipo Task para incluir la categoría (que viene del include)
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
    opacity: isDragging ? 0.5 : 1, // Se hace transparente al arrastrar
    position: "relative" as const,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      // 👇 El "handle" (de donde se agarra) se lo ponemos a todo el li, o a un icono específico
      {...listeners} 
      className={`p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white border-gray-200 touch-none mb-3`}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox (Lo aislamos del drag para que se pueda clickear) */}
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
         {/* Botones (Aislados del drag) */}
         <div onPointerDown={(e) => e.stopPropagation()} className="flex gap-2">
            <Link href={`/task/${task.id}/edit`} className="text-sm text-indigo-600 hover:underline">
                Editar
            </Link>
            <DeleteButton taskId={task.id} />
         </div>
         {/* Icono de Drag (Visual) */}
         <span className="text-gray-300 cursor-grab text-xl">≡</span>
      </div>
    </li>
  );
}

// 👇 COMPONENTE PRINCIPAL DE LA LISTA
export default function TaskList({ initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Función que se ejecuta al soltar
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over?.id);
        
        // Reordenamos el array visualmente
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // 🚧 AQUÍ FALTA GUARDAR EN BASE DE DATOS (Lo haremos en el siguiente paso)
      console.log("¡Movido! Nuevo orden pendiente de guardar.");
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