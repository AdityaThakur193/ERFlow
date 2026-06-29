"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Wrench, 
  Building2, 
  UserCog, 
  X 
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  // Get user details
  async function getUser() {
    try {
      const response = await fetch("/api/me");
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Error fetching user in sidebar:", error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  // Close sidebar on pathname change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

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

  const sidebarContent = (
    <div className="flex flex-col h-full w-full">
      {/* Brand Logo Header */}
      <div 
        className="h-16 flex items-center justify-between px-6 border-b"
        style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-primary)" }}
      >
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

        {/* Close Button on Mobile Drawer */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden btn-icon"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {filteredLinks.map((link) => {
          const NavIcon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
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

      {/* User profile & session status at bottom */}
      {user && (
        <div 
          className="p-4 border-t"
          style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-secondary)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-inverse)",
                borderColor: "var(--color-border-default)",
              }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden text-left">
              <p className="font-bold text-xs truncate" style={{ color: "var(--color-text-primary)" }}>
                {user.username}
              </p>
              <p className="text-[9px] uppercase font-bold tracking-wider" style={{ color: "var(--color-accent)" }}>
                {user.position}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Persistent Sidebar ── */}
      <aside 
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 border-r z-30"
        style={{ 
          backgroundColor: "var(--color-surface-primary)", 
          borderColor: "var(--color-border-light)" 
        }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile Drawer Sidebar ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-45 md:hidden"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[80vw] z-50 flex flex-col md:hidden shadow-2xl border-r"
              style={{
                backgroundColor: "var(--color-surface-primary)",
                borderColor: "var(--color-border-light)",
              }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
