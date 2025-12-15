import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Mi Portfolio 🚀
        </Link>
        
        <div className="flex gap-4">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link href="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </Link>
          <Link href="/task" className="hover:text-blue-400 transition">
            Task
          </Link>
        </div>
      </div>
    </nav>
  );
}