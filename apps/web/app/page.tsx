"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-900/40" />
            <p className="text-lg font-bold tracking-wide text-white">ChatApp</p>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/signin" className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">
              Sign in
            </Link>
            <Link href="/signup" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:brightness-110">
              Sign up
            </Link>
          </nav>
        </div>
        <div className="h-0.5 w-full overflow-hidden bg-white/5">
          <div className="h-full w-1/3 animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-7xl flex-col items-center justify-center px-6 text-center md:px-10">
        <p className="mb-5 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
          Real-time collaboration
        </p>

        <h1 className="mb-5 bg-gradient-to-r from-cyan-200 via-blue-100 to-cyan-200 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-7xl">
          Chat App
        </h1>

        <p className="max-w-2xl text-base text-slate-300 md:text-lg">
          Create rooms, join team conversations, and message instantly with a modern real-time experience built for speed and focus.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/signup" className="group rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-7 py-3 text-base font-bold text-white shadow-xl shadow-blue-900/40 transition hover:-translate-y-0.5 hover:brightness-110">
            Get Started
            <span className="ml-2 inline-block transition group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/signin" className="rounded-2xl border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-slate-100 transition hover:bg-white/10">
            I already have an account
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-slate-400 md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} ChatApp. Built for realtime conversations.</p>
          <p className="text-slate-500">Fast • Secure • Collaborative</p>
        </div>
      </footer>
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
