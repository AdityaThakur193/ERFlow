"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: "var(--color-surface-primary)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: "var(--color-primary)" }} />
            <h1 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Sign in
            </h1>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Emergency Dashboard access
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded-xl"
              style={{
                color: "var(--color-danger)",
                backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary py-3"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
            Secure auth uses an HTTP-only cookie.
            {process.env.NODE_ENV !== "production" ? " Dev credentials: admin@example.com / admin123" : " Configure credentials via environment variables."}
          </p>
        </form>
      </div>
    </div>
  );
}

