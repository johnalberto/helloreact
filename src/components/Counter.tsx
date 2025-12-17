// src/components/Contador.tsx
"use client"; // <--- ESTO ES OBLIGATORIO para usar hooks

import { useState } from "react";

export default function Contador() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Has hecho click {count} veces
    </button>
  );
}