"use client";

import Link from "next/link";
import { useState } from "react";
import { submitSignup } from "./action";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    const result = await submitSignup(email, password, name);
    if (result?.error) {
      setMessage(result.error);
      setIsError(true);
    } else if (result?.success) {
      setMessage("Account created. Redirecting to sign in...");
      setIsError(false);
      setTimeout(() => router.push("/signin"), 800);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-900/20">
        <h2 className="text-center text-3xl font-bold text-white">Create account</h2>
        <form className="mt-8 space-y-5" onSubmit={handleSignup}>
          <input placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
          <input placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
          <input placeholder="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
          {message && <div className={`rounded-xl px-3 py-2 text-sm ${isError ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300"}`}>{message}</div>}
          <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-blue-500 py-2.5 font-semibold text-white hover:bg-blue-400 disabled:opacity-50">{isLoading ? "Creating..." : "Sign up"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link href="/signin" className="text-blue-300">Sign in</Link></p>
      </div>
    </div>
  );
}
