"use client"; // Obligatorio para hooks

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  // Este hook lee automáticamente el estado del formulario padre
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending} // Desactivar si está cargando
      className={`py-2 px-4 rounded transition text-white 
        ${pending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      {pending ? "Guardando..." : "Guardar Usuario"}
    </button>
  );
}