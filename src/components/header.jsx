"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AddPatientModal from "@/components/patients/AddPatientModal";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import AddDoctorModal from "@/components/doctors/AddDoctorModal";

import { useTheme } from "@/hooks/useTheme";

import { Sun, Moon, LogOut, Sparkles } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  const router = useRouter();

  const [user, setUser] = useState(null);

  const [loggingOut, setLoggingOut] = useState(false);

  // GET USER
  async function getUser() {
    try {
      const response = await fetch("/api/me");

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // LOGOUT
  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <header
      className="
        relative
        w-full
      "
    >
      <div className="px-4 md:px-6 pt-[88px] md:pt-6 pb-4">
        <div
          className="
            rounded-3xl
            border

            p-4 md:p-5

            flex flex-col
            gap-5

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
          style={{
            backgroundColor: "var(--color-surface-primary)",
            borderColor: "var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* LEFT */}
          <div className="flex flex-col gap-4 min-w-0">
            {/* WELCOME */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="
                    text-xl
                    sm:text-2xl
                    lg:text-3xl

                    font-bold
                    tracking-tight

                    truncate
                  "
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                >
                  Welcome Back, {user?.username || "User"}
                </h1>

                <Sparkles
                  size={18}
                  style={{
                    color: "var(--color-primary-active)",
                  }}
                />
              </div>

              <p
                className="text-sm mt-1"
                style={{
                  color: "var(--color-text-secondary)",
                }}
              >
                {user?.position || "Loading role..."}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div
              className="
                flex flex-wrap
                items-center
                gap-3
              "
            >
              {(user?.position === "Admin" || user?.position === "Receptionist") && (
                <AddPatientModal />
              )}

              {user?.position === "Admin" && (
                <>
                  <AddDoctorModal />
                  <AddEquipmentModal />
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
              flex flex-wrap
              items-center

              gap-3

              lg:justify-end
            "
          >
            {/* STATUS */}
            <div
              className="
                flex items-center gap-2

                rounded-2xl
                px-4 py-3

                border

                whitespace-nowrap
              "
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-success) 10%, transparent)",

                borderColor:
                  "color-mix(in srgb, var(--color-success) 18%, transparent)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: "var(--color-success)",
                }}
              />

              <span
                className="text-sm font-medium"
                style={{
                  color: "var(--color-success)",
                }}
              >
                System Online
              </span>
            </div>

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="
                h-12 px-4

                rounded-2xl
                border

                flex items-center gap-2

                transition-all duration-200

                whitespace-nowrap
              "
              style={{
                backgroundColor: "var(--color-surface-secondary)",
                borderColor: "var(--color-border-light)",
                color: "var(--color-text-primary)",
              }}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}

              <span className="hidden sm:inline text-sm font-medium">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                h-12 px-4

                rounded-2xl
                border

                flex items-center gap-2

                transition-all duration-200

                whitespace-nowrap
              "
              style={{
                backgroundColor: "var(--color-surface-secondary)",
                borderColor: "var(--color-border-light)",
                color: "var(--color-text-primary)",
              }}
            >
              <LogOut size={18} />

              <span className="hidden sm:inline text-sm font-medium">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
