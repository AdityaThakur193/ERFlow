"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/logout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        router.replace("/login");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-xl font-semibold text-zinc-900">Logging out...</h1>
        <p className="text-sm text-zinc-500 mt-2">Redirecting to login page</p>
      </div>
    </div>
  );
}

