"use server"
import { BACKEND_URL } from "../config";


export async function submitSignup(email:string, password:string, name:string) {
    try {
    // This runs on the Next.js server, so it bypasses CORS entirely!
        const response = await fetch(`${BACKEND_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name}),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "SignIn failed" };
        }

        return { success: true, message: data.message };
    } catch {
        return { error: "Something went wrong connecting to the backend." };
    }
}


