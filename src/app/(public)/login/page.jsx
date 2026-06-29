"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ShieldCheck } from "lucide-react";

import { toast } from "@/components/providors/CustomToast";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMsg("");

      const response = await fetch("/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Login Successful");

        router.push("/dashboard");
      } else {
        const errorText = data.message || "Login Failed";
        setErrorMsg(errorText);
        toast.error(errorText);
      }
    } catch (error) {
      console.log(error);
      const errorText = "Something went wrong";
      setErrorMsg(errorText);
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "receptionist@example.com",
          password: "password123",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Logged in as Receptionist!");
        router.push("/dashboard");
      } else {
        const errorText = data.message || "Demo Login Failed";
        setErrorMsg(errorText);
        toast.error(errorText);
      }
    } catch (error) {
      console.log(error);
      const errorText = "Something went wrong";
      setErrorMsg(errorText);
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "var(--color-bg-primary)",
      }}
    >
      <div className="w-full max-w-md card p-8">
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} style={{ color: "var(--color-primary)" }} />

            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Login
            </h1>
          </div>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Access the ERFlow dashboard
          </p>
        </div>

        {/* DEMO CARD */}
        <div 
          className="mb-6 p-4 rounded-xl border flex flex-col gap-2.5 transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-primary) 6%, var(--color-bg-secondary))",
            borderColor: "var(--color-border-light)"
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🚀</span>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
                Demo Environment
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" }}>
              Ready to Explore
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Explore the platform instantly as a receptionist with preloaded mock patient and doctor data.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn btn-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer"
            style={{ 
              borderRadius: "var(--radius-md)", 
              border: "1px solid var(--color-border-strong)",
              backgroundColor: "var(--color-surface-primary)",
              color: "var(--color-text-secondary)"
            }}
          >
            <span>One-Click Demo Login</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="input"
              autoComplete="username"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="input"
              autoComplete="current-password"
              required
            />
          </div>

          {/* ERROR DISPLAY */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary py-3"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* FOOTER TEXT */}
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Don&apos;t have an account? Contact your system administrator.
            Accounts are created and managed exclusively by the Admin.
          </p>
        </form>
      </div>
    </div>
  );
}
