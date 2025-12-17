"use client";

import { useFormStatus } from "react-dom"; // ✅ En React 19, este se queda en react-dom

interface SubmitButtonProps {
  label: string;            // Texto normal (ej: "Crear Tarea")
  loadingLabel?: string;    // Texto cargando (ej: "Guardando...")
}

export default function SubmitButton({ 
  label, 
  loadingLabel = "Guardando..." // Valor por defecto
}: SubmitButtonProps) {
  
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded text-white transition-colors ${
        pending 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {pending ? loadingLabel : label}
    </button>
  );
}