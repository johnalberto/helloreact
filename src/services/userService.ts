// src/services/userService.ts
import { User } from "@/types/users";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  
  if (!res.ok) throw new Error("Error al obtener usuarios");
  
  return res.json();
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  
  if (!res.ok) throw new Error(`No se encontró el usuario ${id}`);
  
  return res.json();
}