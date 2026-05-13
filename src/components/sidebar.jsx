"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { LayoutDashboard, Users, Stethoscope, Wrench } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  useTheme();
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      name: "Doctors",
      href: "/doctors",
      icon: Stethoscope,
    },
    {
      name: "Equipment",
      href: "/equipment",
      icon: Wrench,
    },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div
        className="md:hidden fixed top-0 left-0 w-full z-50 px-4 py-3 flex items-center justify-between transition-colors duration-200"
        style={{
          backgroundColor: "var(--color-surface-primary)",
          borderBottomColor: "var(--color-border-light)",
          borderBottomWidth: "1px",
        }}
      >
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          ERFlow
        </h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl transition-transform duration-200"
          style={{ color: "var(--color-text-primary)" }}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-72
          transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{
          backgroundColor: "var(--color-surface-secondary)",
          borderRightColor: "var(--color-border-default)",
          borderRightWidth: "1px",
        }}
      >
        {/* Logo */}
        <div
          className="h-20 flex items-center px-6 transition-colors duration-200"
          style={{
            borderBottomColor: "var(--color-border-light)",
            borderBottomWidth: "1px",
            backgroundColor: "var(--color-surface-primary)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
              style={{
                backgroundColor: "var(--color-primary-active)",
                color: "var(--color-text-inverse)",
              }}
            >
              ER
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Flow
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const NavIcon = link.icon;
            const isActive = pathname === link.href;
            return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="
                px-4 py-3 rounded-lg
                transition-all duration-200
                flex items-center gap-3
                text-sm font-medium
              "
              style={{
                color: isActive
                  ? "var(--color-primary-active)"
                  : "var(--color-text-primary)",
                backgroundColor: isActive
                  ? "color-mix(in srgb, var(--color-primary) 18%, transparent)"
                  : "transparent",
                borderColor: isActive
                  ? "color-mix(in srgb, var(--color-primary) 35%, transparent)"
                  : "transparent",
                borderWidth: "1px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive
                  ? "color-mix(in srgb, var(--color-primary) 18%, transparent)"
                  : "transparent";
              }}
            >
              <NavIcon size={18} />
              {link.name}
            </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 w-full p-4 transition-colors duration-200"
          style={{
            borderTopColor: "var(--color-border-light)",
            borderTopWidth: "1px",
            backgroundColor: "var(--color-surface-primary)",
          }}
        >
          <div
            className="text-xs transition-colors duration-200"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <p className="font-medium">Emergency Room</p>
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              ERFlow v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}
    </>
  );
}
