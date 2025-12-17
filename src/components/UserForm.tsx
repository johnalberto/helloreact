"use client";
import { createUser } from "@/actions/user-actions";
import SubmitButton from "./SubmitButton"; // <--- Importar

export default function UserForm() {
  return (
    <div className="bg-slate-200 p-6 rounded-lg mb-8">
      <h3 className="text-lg font-bold mb-4 text-slate-800">Agregar Nuevo Usuario</h3>
      
      {/* OJO AQUÍ: El atributo "action" llama DIRECTAMENTE 
         a la función del servidor que importamos. 
         Sin fetch, sin axios, sin API routes.
      */}
      <form action={createUser} className="flex flex-col gap-4 max-w-sm">
        
        <input 
          type="text" 
          name="name" 
          placeholder="Nombre completo" 
          className="p-2 rounded border border-gray-300 text-black"
          required
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Correo electrónico" 
          className="p-2 rounded border border-gray-300 text-black"
          required
        />

        <SubmitButton label="Guardar usuario" />
        
      </form>
    </div>
  );
}