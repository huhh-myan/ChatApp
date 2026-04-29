"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1 text-sm text-blue-200">
          Real-time team chat
        </div>
        <h1 className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          Welcome to ChatApp
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Create rooms, join conversations, and collaborate instantly with your team across WebSocket-powered channels.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signin"
            className="rounded-xl bg-blue-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-700/30 transition hover:bg-blue-400"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-slate-600 bg-slate-900 px-8 py-3 text-lg font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
