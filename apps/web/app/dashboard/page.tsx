"use client";

import { useState } from "react";

const sampleRooms = [
  { id: 1, name: "general" },
  { id: 2, name: "project-alpha" },
  { id: 3, name: "random" },
  { id: 4, name: "gaming-chat" },
];

const sampleMessages = [
  "Welcome to your room 👋",
  "Try sending a message from the input below.",
  "WebSocket events will appear here when wired.",
];

export default function DashboardPage() {
  const [activeRoom, setActiveRoom] = useState(sampleRooms[0]);
  const [draft, setDraft] = useState("");

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-slate-800 bg-blue-950 px-8 py-5">
        <h1 className="text-3xl font-bold text-blue-100">ChatApp Dashboard</h1>
        <button className="rounded-xl bg-blue-500 px-5 py-2 text-lg font-medium hover:bg-blue-400">Logout</button>
      </header>

      <section className="grid min-h-[calc(100vh-88px)] grid-cols-1 gap-8 p-8 lg:grid-cols-[350px,1fr]">
        <aside className="rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
          <h2 className="mb-4 text-xl font-semibold">Your Rooms</h2>
          <div className="space-y-3">
            {sampleRooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-3">
                <p className="font-medium">#{room.name}</p>
                <div className="space-x-2">
                  <button onClick={() => setActiveRoom(room)} className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold hover:bg-blue-400">Open</button>
                  <button className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-200">Leave</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl bg-blue-500 py-2.5 font-semibold hover:bg-blue-400">Create Room</button>
        </aside>

        <div className="mx-auto flex w-full max-w-3xl flex-col rounded-3xl border border-blue-600/40 bg-gradient-to-b from-slate-950 to-blue-950 p-6 shadow-2xl shadow-blue-900/30">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">#{activeRoom.name}</h3>
            <button className="rounded-xl bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-400">Leave Room</button>
          </div>

          <div className="mb-6 flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/40 p-4">
            {sampleMessages.map((msg) => (
              <p key={msg} className="rounded-lg bg-slate-800/80 px-3 py-2 text-slate-100">{msg}</p>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message from here..."
              className="flex-1 rounded-xl border border-slate-600 bg-slate-200 px-4 py-3 text-black placeholder:text-slate-500"
            />
            <button className="rounded-xl bg-blue-500 px-6 py-3 text-lg font-semibold hover:bg-blue-400">Send Message</button>
          </div>
        </div>
      </section>
    </main>
  );
}
