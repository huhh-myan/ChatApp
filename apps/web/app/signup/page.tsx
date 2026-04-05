"use client";

import { useState } from "react";
import { submitSignup } from "./action";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        // Call your server action
        const result = await submitSignup(email, password, name);

        if (result?.error) {
            setMessage(result.error);
            setIsError(true);
        } else if (result?.success) {
            setMessage(result.message);
            setIsError(false);

            setTimeout(() => {
                router.push("/signin"); 
            }, 1500);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        
        {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-500">Join the platform to get started</p>
                </div>

        {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                <div className="space-y-4">
                    
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Name Input */}
                    <div>
                        <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Feedback Message (Error or Success) */}
                {message && (
                    <div className={`rounded-md p-3 text-sm text-center font-medium ${
                    isError ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                    {message}
                    </div>
                )}

                {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md bg-black py-2.5 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isLoading ? "Signing up..." : "Sign up"}
                    </button>
                
                </form>
            </div>
        </div>
    );
}