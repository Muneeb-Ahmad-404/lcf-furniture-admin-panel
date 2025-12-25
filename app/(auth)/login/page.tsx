"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth"; // import the hook

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth(); // get login function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.token); // update auth state in the hook
      router.push("/"); // redirect to dashboard
    } catch {
      setError("Server unreachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-white bg-[#103a3a] rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-white text-white rounded px-3 py-2 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-white text-white rounded px-3 py-2 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F69F1B] text-white py-2 rounded font-semibold hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
