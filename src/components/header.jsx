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
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Wrench, 
  Building2, 
  UserCog,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [clockData, setClockData] = useState({ shift: "", dateStr: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

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
      console.log("Error fetching session user:", error);
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
      console.log("Error logging out:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  // Mode Navigation Keys (EMR style)
  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Admin", "Receptionist"],
    },
    {
      name: "My Dashboard",
      href: "/doctor-dashboard",
      icon: LayoutDashboard,
      roles: ["Doctor"],
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      roles: ["Admin", "Doctor", "Receptionist"],
    },
    {
      name: "Doctors",
      href: "/doctors",
      icon: Stethoscope,
      roles: ["Admin"],
    },
    {
      name: "Equipment",
      href: "/equipment",
      icon: Wrench,
      roles: ["Admin", "Receptionist"],
    },
    {
      name: "Departments",
      href: "/departments",
      icon: Building2,
      roles: ["Admin"],
    },
    {
      name: "Staff Registry",
      href: "/staff",
      icon: UserCog,
      roles: ["Admin"],
    },
  ];

  const filteredLinks = user
    ? navLinks.filter((link) => link.roles.includes(user.position))
    : [];

  return (
    <header className="w-full flex flex-col">
      {/* ── 2. Brand & User Operations Control Bar ── */}
      <div className="w-full" style={{ backgroundColor: "var(--color-surface-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-all cursor-pointer"
                style={{ backgroundColor: "var(--color-surface-secondary)" }}
                aria-label="Open navigation menu"
              >
                <Menu size={16} style={{ color: "var(--color-text-primary)" }} />
              </button>
            )}

            <Link href="/" className="flex items-center gap-1 group" style={{ textDecoration: "none" }}>
              <span
                className="text-2xl font-black tracking-tight leading-none"
                style={{ color: "var(--color-accent)", fontFamily: "var(--font-serif)" }}
              >
                ER
              </span>
              <span
                className="text-2xl font-light tracking-tight leading-none"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
              >
                Flow
              </span>
            </Link>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
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

            {/* User Dropdown Menu */}
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
      </div>

      {/* ── 3. EMR Workstation Mode Selectors (Navigation Tabs) ── */}
      <div 
        className="hidden md:block w-full border-t border-b" 
        style={{ 
          borderColor: "var(--color-border-light)",
          backgroundColor: "var(--color-surface-secondary)"
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-stretch justify-between w-full">
          <div className="flex flex-wrap md:flex-nowrap items-stretch flex-1 md:divide-x md:divide-[var(--color-border-light)] md:border-r border-[var(--color-border-light)] w-full">
            {filteredLinks.map((link) => {
              const NavIcon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative emr-tab"
                  style={{
                    color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)"
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeClinicalTab"
                      className="absolute inset-0 bg-[var(--color-primary-light)] z-0"
                      style={{
                        borderBottom: "2px solid var(--color-accent)"
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="flex items-center gap-2 relative z-10 justify-center w-full">
                    <NavIcon size={13} />
                    <span>{link.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Clinical Shift Indicator Widget */}
          {clockData.shift && (
            <div className="hidden lg:flex items-center gap-3 px-6 text-xs text-[var(--color-text-secondary)] font-medium bg-[var(--color-surface-primary)] border-l border-[var(--color-border-light)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span>Duty Shift: {clockData.shift}</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="font-mono text-[11px]">{clockData.dateStr}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 md:hidden"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 flex flex-col md:hidden shadow-2xl text-left border-r"
              style={{
                backgroundColor: "var(--color-surface-primary)",
                borderColor: "var(--color-border-default)",
              }}
            >
              {/* Header block inside drawer */}
              <div
                className="p-4 flex items-center justify-between border-b"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-1"
                  style={{ textDecoration: "none" }}
                  onClick={() => setMobileSidebarOpen(false)}
                >
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

                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="btn-icon"
                  aria-label="Close menu"
                >
                  <X size={18} style={{ color: "var(--color-text-primary)" }} />
                </button>
              </div>

              {/* User Profiling Block */}
              {user && (
                <div
                  className="p-4 border-b"
                  style={{
                    borderColor: "var(--color-border-light)",
                    backgroundColor: "var(--color-surface-secondary)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-inverse)",
                        borderColor: "var(--color-border-default)",
                      }}
                    >
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate" style={{ color: "var(--color-text-primary)" }}>
                        {user.username}
                      </p>
                      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--color-accent)" }}>
                        {user.position}
                      </p>
                      {user.email && (
                        <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links Scroll Container */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {filteredLinks.map((link) => {
                  const NavIcon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                        backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                      }}
                    >
                      <NavIcon size={16} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Shift status & logout action footer */}
              <div
                className="p-4 border-t space-y-3"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                {clockData.shift && (
                  <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                      <span>{clockData.shift}</span>
                    </span>
                    <span className="font-mono">{clockData.dateStr}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between gap-2">
                  {user && <ChangePasswordModal username={user.username} variant="menuItem" />}
                  
                  <button
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      handleLogout();
                    }}
                    disabled={loggingOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-danger)] cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>{loggingOut ? "..." : "Log Out"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
