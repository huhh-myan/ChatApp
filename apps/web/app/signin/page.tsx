"use client";

import Link from "next/link";
import { useState } from "react";
import { submitSignin } from "./action";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await submitSignin(email, password);

    if (result?.error) {
      setMessage(result.error);
      setIsError(true);
    } else if (result?.success) {
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      setMessage("Signed in successfully. Redirecting to dashboard...");
      setIsError(false);
      setTimeout(() => router.push("/dashboard"), 800);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-900/20 backdrop-blur">
        <h2 className="text-center text-3xl font-bold text-white">Sign in</h2>
        <p className="mt-2 text-center text-sm text-slate-400">Welcome back to ChatApp</p>

        <form className="mt-8 space-y-5" onSubmit={handleSignin}>
          <div>
            <label htmlFor="email" className="text-sm text-slate-300">Email address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-slate-300">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none" />
          </div>
          {message && <div className={`rounded-xl px-3 py-2 text-sm ${isError ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300"}`}>{message}</div>}
          <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-blue-500 py-2.5 font-semibold text-white hover:bg-blue-400 disabled:opacity-50">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">No account? <Link href="/signup" className="text-blue-300 hover:text-blue-200">Sign up</Link></p>
      </div>
    </div>
  );
}
