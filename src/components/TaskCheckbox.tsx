"use client";

import { toggleTask } from "@/actions/task-actions";
import { useTransition } from "react";

interface Props {
  taskId: number;
  isCompleted: boolean;
}

export default function TaskCheckbox({ taskId, isCompleted }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    
    // Ejecutamos la Server Action
    startTransition(async () => {
      await toggleTask(taskId, newValue);
    });
  };

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      onChange={handleChange}
      disabled={isPending}
      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
    />
  );
}