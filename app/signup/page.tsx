// app/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [err, setErr] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, pass, name);
      router.push("/dashboard");
    } catch (error: any) {
      setErr(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handle} className="w-full max-w-md p-6 border rounded">
        <h2 className="text-xl mb-4">Create account</h2>
        {err && <p className="text-red-600">{err}</p>}
        <input className="w-full p-2 border mb-2" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-4" placeholder="Password" value={pass} onChange={(e)=>setPass(e.target.value)} />
        <button className="w-full bg-green-600 text-white py-2 rounded">Sign up</button>
      </form>
    </div>
  );
}
