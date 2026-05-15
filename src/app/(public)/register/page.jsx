"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    position: "Receptionist",
  });

  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User Created Successfully");

        router.push("/login");
      } else {
        toast.error(data.message || "Registration Failed");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-zinc-200 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Register</h1>

          <p className="text-zinc-500 mt-2">Create a new ERFlow account</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            className="border border-zinc-300 rounded-xl px-4 py-3 outline-none text-black"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="border border-zinc-300 rounded-xl px-4 py-3 outline-none text-black"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            className="border border-zinc-300 rounded-xl px-4 py-3 outline-none text-black"
            required
          />

          <select
            value={formData.position}
            onChange={(e) =>
              setFormData({
                ...formData,
                position: e.target.value,
              })
            }
            className="border border-zinc-300 rounded-xl px-4 py-3 outline-none text-black"
          >
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-zinc-800 text-white rounded-xl py-3 font-medium transition-all"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
