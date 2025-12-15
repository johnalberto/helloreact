// src/actions/user-actions.ts
"use server"; // <--- 🚨 ESTO ES OBLIGATORIO. Define que este archivo es solo Backend.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Esta función recibe "FormData" automáticamente cuando se envía un formulario
export async function createUser(formData: FormData) {
  // 1. Extraer datos del formulario
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();

  if (!name || !email) {
    console.error("Faltan datos");
    return;
  }

  // 2. Simular guardado en base de datos (Aquí iría tu Prisma/SQL)
  console.log("-----------------------------------------");
  console.log("🔥 SERVER ACTION EJECUTÁNDOSE EN EL BACKEND");
  console.log(`👤 Creando usuario: ${name} (${email})`);
  console.log("-----------------------------------------");

  // Simulamos una espera de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Revalidar Caché (Importante)
  // Esto le dice a Next.js: "Oye, los datos de /dashboard han cambiado, bórralos de la memoria y tráelos frescos".
  revalidatePath("/dashboard");

  // 4. Redireccionar
  redirect("/dashboard");
}