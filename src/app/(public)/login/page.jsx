"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();





  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message || "Login failed.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black">Sign in</h1>
          <p className="text-sm text-zinc-500 mt-1">Emergency Dashboard access</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-zinc-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-xl px-4 py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Secure auth uses an HTTP-only cookie. Configure credentials via environment variables.
          </p>
        </form>
      </div>
    </div>
  );
}

