"use client";
import AddPatientModal from "@/components/patients/AddPatientModal";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import AddDoctorModal from "@/components/doctors/AddDoctorModal";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header(props) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  }

  return (
    <header
      className="w-full transition-colors duration-200 sticky top-0 z-30"
      style={{
        borderBottomColor: "var(--color-border-light)",
        borderBottomWidth: "1px",
        backgroundColor: "var(--color-surface-secondary)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        {/* Top Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Emergency Dashboard
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Monitor and manage emergency room operations
            </p>
          </div>

          {/* ER Status Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn btn-secondary"
              aria-label="Log out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{loggingOut ? "Logging out..." : "Log out"}</span>
            </button>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap hidden sm:flex"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-success) 15%, transparent)",
                borderColor: "color-mix(in srgb, var(--color-success) 30%, transparent)",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-success)" }}
              />
              <span className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <AddPatientModal />
          <AddDoctorModal />
          <AddEquipmentModal />
        </div>
      </div>
    </header>
  );
}