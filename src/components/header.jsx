"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import AddPatientModal from "@/components/patients/AddPatientModal";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import { useTheme } from "@/hooks/useTheme";

import { 
  Sun, 
  Moon, 
  LogOut, 
  Menu 
} from "lucide-react";

export default function Header({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [clockData, setClockData] = useState({ shift: "", dateStr: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const hours = now.getHours();
      let shift = "Night Shift";
      if (hours >= 7 && hours < 15) {
        shift = "Morning Shift";
      } else if (hours >= 15 && hours < 23) {
        shift = "Evening Shift";
      }
      
      const options = { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      const dateStr = now.toLocaleDateString("en-US", options);
      setClockData({ shift, dateStr });
    }
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // GET USER DETAILS
  async function getUser() {
    try {
      const response = await fetch("/api/me");
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Error fetching session user in header:", error);
    }
  }

  // DISCONNECT / LOGOUT
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.replace("/login");
    } catch (error) {
      console.log("Error logging out in header:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const getPageTitle = (path) => {
    if (path.startsWith("/dashboard")) return "Operations Dashboard";
    if (path.startsWith("/doctor-dashboard")) return "Clinical Workspace";
    if (path.startsWith("/patients")) return "Patient Registry";
    if (path.startsWith("/doctors")) return "Doctor Registry";
    if (path.startsWith("/equipment")) return "Equipment Inventory";
    if (path.startsWith("/departments")) return "Department Management";
    if (path.startsWith("/staff")) return "Staff Directory";
    return "ERFlow EMR";
  };

  return (
    <header 
      className="w-full border-b sticky top-0 z-20 h-16 flex items-center px-4 sm:px-6"
      style={{ 
        backgroundColor: "var(--color-surface-primary)",
        borderColor: "var(--color-border-light)"
      }}
    >
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left Section: Mobile menu toggle + Logo (mobile) OR Page Title (desktop) */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger (Visible on mobile only) */}
          {user && (
            <button
              onClick={onMenuToggle}
              className="md:hidden p-1.5 rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-all cursor-pointer"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
              aria-label="Open navigation menu"
            >
              <Menu size={16} style={{ color: "var(--color-text-primary)" }} />
            </button>
          )}

          {/* Logo on mobile / Context Page Title on desktop */}
          <div className="md:hidden">
            <Link href="/" className="flex items-center gap-1" style={{ textDecoration: "none" }}>
              <span
                className="text-xl font-black tracking-tight leading-none"
                style={{ color: "var(--color-accent)", fontFamily: "var(--font-serif)" }}
              >
                ER
              </span>
              <span
                className="text-xl font-light tracking-tight leading-none"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
              >
                Flow
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <h1 
              className="text-lg font-bold font-serif leading-none"
              style={{ color: "var(--color-text-primary)" }}
            >
              {getPageTitle(pathname)}
            </h1>
          </div>
        </div>

        {/* Right Section: Duty Shift, Quick Actions, Theme, Profile */}
        <div className="flex items-center gap-3">
          {/* Clinical Shift Indicator Widget (Desktop only) */}
          {clockData.shift && (
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 text-[11px] rounded-lg border"
              style={{ 
                color: "var(--color-text-secondary)", 
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface-secondary)" 
              }}
            >
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span>Duty Shift: {clockData.shift}</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="font-mono text-[10px]">{clockData.dateStr}</span>
            </div>
          )}

          {/* Add Patient Button (if Admin or Receptionist) */}
          {(user?.position === "Admin" || user?.position === "Receptionist") && (
            <AddPatientModal />
          )}

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shrink-0 cursor-pointer border hover:border-[var(--color-border-strong)] transition-all"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                  borderColor: "var(--color-border-default)",
                }}
                title={`Logged in as ${user.username}`}
              >
                {user.username.slice(0, 2).toUpperCase()}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-lg border p-2 z-40 shadow-lg text-left"
                      style={{
                        backgroundColor: "var(--color-surface-primary)",
                        borderColor: "var(--color-border-strong)",
                      }}
                    >
                      {/* User Profile Info */}
                      <div className="px-3 py-2 border-b border-[var(--color-border-light)] mb-1">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--color-text-primary)" }}>{user.username}</p>
                        <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-accent)" }}>{user.position}</p>
                        {user.email && <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>{user.email}</p>}
                      </div>

                      {/* Menu Actions */}
                      <div className="space-y-1">
                        <ChangePasswordModal username={user.username} variant="menuItem" />
                        
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors text-[var(--color-danger)] cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
