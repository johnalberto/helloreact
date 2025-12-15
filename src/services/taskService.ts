export interface Task {
  id: number;
  title: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

// Exportamos la función para que sea "public"
export async function getTasksFromDB(): Promise<Task[]> {
  // Simulamos delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return [
    { id: 1, title: 'Revisar logs de Azure', priority: 'Alta' },
    { id: 2, title: 'Actualizar dependencias', priority: 'Baja' },
    { id: 3, title: 'Code Review del equipo', priority: 'Media' },
  ];
}