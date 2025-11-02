// app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMsg("Password reset email sent.");
    } catch (err: any) {
      setMsg(err.message || "Error sending email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handle} className="w-full max-w-md p-6 border rounded">
        <h2 className="text-xl mb-4">Reset password</h2>
        <input className="w-full p-2 border mb-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <button className="w-full bg-yellow-600 py-2 rounded">Send Reset Email</button>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
