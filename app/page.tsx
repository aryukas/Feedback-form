// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Inventory Management System</h1>
      <div className="mt-6 flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
        <Link href="/signup" className="px-4 py-2 border rounded">Sign up</Link>
      </div>
    </main>
  );
}
