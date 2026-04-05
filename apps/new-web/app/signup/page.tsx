"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// If you want frontend validation, you can import your shared schema:
import { CreateUserSchema } from "@repo/common/types";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
            e.preventDefault();
            setError("");
            setSuccessMsg("");
            setLoading(true);

        // Optional: Frontend Zod Validation using your Turborepo shared package
        const parsedData = CreateUserSchema.safeParse({ email, password });
        if (!parsedData.success) {
            setError("Invalid email or password format");
            setLoading(false);
            return;
        }


        try {
            const response = await fetch("http://localhost:3001/signup", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                },
                    body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handles 411 Incorrect Inputs or Prisma User Already Exists errors
                throw new Error(data.message || "Something went wrong");
            }

            // Success state
            setSuccessMsg(data.message);

            // Optional: Redirect to signin after a short delay
            setTimeout(() => {
                router.push("/signin"); 
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Create an Account
            </h2>

            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}
        
            {successMsg && (
                <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    </div>
    );
}