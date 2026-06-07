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
