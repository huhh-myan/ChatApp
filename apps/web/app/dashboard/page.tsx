"use client";

import { useEffect, useMemo, useState } from "react";
import { BACKEND_URL } from "../config";
import { useSocket } from "../../hooks/useSocket";
import { useRouter } from "next/navigation";

type ChatMessage = { message: string; userId?: string; mine?: boolean; createdAt?: string };
type RoomItem = { slug: string; roomId: number };

const ROOMS_KEY = "chatapp.rooms";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [activeRoom, setActiveRoom] = useState<RoomItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [roomDraft, setRoomDraft] = useState("");
  const [status, setStatus] = useState("Ready to chat");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { socket, loading } = useSocket(token);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/signin");
      return;
    }

    setToken(savedToken);
    const storedRooms = localStorage.getItem(ROOMS_KEY);
    if (storedRooms) {
      const parsed = JSON.parse(storedRooms) as RoomItem[];
      setRooms(parsed);
      if (parsed.length > 0) setActiveRoom(parsed[0]);
    }
  }, [router]);

  useEffect(() => {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    if (!socket || !activeRoom) return;

    socket.send(JSON.stringify({ type: "JOIN_ROOM", roomId: `${activeRoom.roomId}` }));

    const handleMessage = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "CHAT" && Number(parsed.roomId) === activeRoom.roomId) {
          setMessages((prev) => [
            { message: parsed.message, createdAt: new Date().toISOString() },
            ...prev,
          ]);
        }
      } catch {
        // ignore non-json ws system messages
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.send(JSON.stringify({ type: "LEAVE_ROOM", roomId: `${activeRoom.roomId}` }));
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, activeRoom]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeRoom || !token) return;
      setIsLoadingMessages(true);
      const response = await fetch(`${BACKEND_URL}/chat/${activeRoom.roomId}`, {
        headers: { Authorization: token },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
      setIsLoadingMessages(false);
    };

    loadMessages();
  }, [activeRoom, token]);

  const roomNames = useMemo(() => new Set(rooms.map((r) => r.slug)), [rooms]);

  const addRoom = async () => {
    if (!roomDraft.trim() || !token) return;
    setStatus("Creating room...");

    await fetch(`${BACKEND_URL}/create-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ slug: roomDraft }),
    });

    const roomRes = await fetch(`${BACKEND_URL}/room/${roomDraft}`, {
      headers: { Authorization: token },
    });
    const roomData = await roomRes.json();

    if (roomData?.id && !roomNames.has(roomDraft)) {
      const newRoom = { slug: roomDraft, roomId: roomData.id as number };
      setRooms((prev) => [newRoom, ...prev]);
      setActiveRoom(newRoom);
      setRoomDraft("");
      setStatus(`Joined #${newRoom.slug}`);
      return;
    }

    setStatus("Room already exists in your list or lookup failed.");
  };

  const sendMessage = () => {
    if (!socket || !activeRoom || !messageDraft.trim()) return;

    socket.send(
      JSON.stringify({
        type: "CHAT",
        roomId: `${activeRoom.roomId}`,
        message: messageDraft,
      }),
    );

    setMessages((prev) => [
      {
        message: messageDraft,
        mine: true,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setMessageDraft("");
  };

  const removeRoom = (roomId: number) => {
    const next = rooms.filter((room) => room.roomId !== roomId);
    setRooms(next);
    if (activeRoom?.roomId === roomId) {
      setActiveRoom(next[0] ?? null);
      setMessages([]);
    }
    setStatus("Room removed from your dashboard.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Realtime chat workspace</p>
            <h1 className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-3xl font-extrabold text-transparent">
              ChatApp Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${loading ? "border-amber-400/50 bg-amber-500/10 text-amber-200" : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"}`}>
              {loading ? "Connecting..." : "Live"}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/signin");
              }}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-7xl grid-cols-1 gap-6 px-6 py-8 md:px-10 lg:grid-cols-[330px,1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl">
          <h2 className="mb-1 text-xl font-bold text-white">Your Rooms</h2>
          <p className="mb-4 text-sm text-slate-300">Create or open a room to start messaging.</p>

          <div className="mb-4 flex gap-2">
            <input
              value={roomDraft}
              onChange={(e) => setRoomDraft(e.target.value)}
              placeholder="room slug"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/60 transition placeholder:text-slate-500 focus:ring"
            />
            <button
              onClick={addRoom}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:brightness-110"
            >
              Add
            </button>
          </div>

          <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/20 p-4 text-sm text-slate-400">
                No rooms yet. Create one using the input above.
              </div>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.roomId}
                  className={`flex items-center justify-between rounded-xl border p-3 transition ${activeRoom?.roomId === room.roomId ? "border-cyan-300/50 bg-cyan-500/10" : "border-white/10 bg-slate-900/50"}`}
                >
                  <button onClick={() => setActiveRoom(room)} className="truncate text-left font-semibold hover:text-cyan-300">
                    #{room.slug}
                  </button>
                  <button
                    onClick={() => removeRoom(room.roomId)}
                    className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Leave
                  </button>
                </div>
              ))
            )}
          </div>

          <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">{status}</p>
        </aside>

        <div className="flex flex-col rounded-3xl border border-cyan-300/20 bg-gradient-to-b from-slate-900/80 to-blue-950/60 p-5 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <h3 className="text-xl font-bold text-white">
              {activeRoom ? `#${activeRoom.slug}` : "Select a room"}
            </h3>
            <span className="text-xs text-slate-300">Messages: {messages.length}</span>
          </div>

          <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            {isLoadingMessages ? (
              <p className="text-sm text-slate-400">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-slate-400">No messages yet. Send the first one 🚀</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={`${msg.message}-${idx}`} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-lg ${msg.mine ? "ml-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : "bg-white/10 text-slate-100"}`}>
                  <p>{msg.message}</p>
                </div>
              ))
            )}
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
              value={messageDraft}
              onChange={(e) => setMessageDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Write a message..."
              className="flex-1 rounded-xl border border-white/15 bg-slate-100 px-4 py-3 text-black placeholder:text-slate-500 outline-none ring-cyan-500 transition focus:ring"
            />
            <button
              onClick={sendMessage}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-blue-900/40 transition hover:brightness-110"
            >
              Send
            </button>
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
