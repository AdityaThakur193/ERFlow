"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useTheme } from "@/hooks/useTheme";

import { LayoutDashboard, Users, Stethoscope, Wrench, Building2, UserCog } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useTheme();

  const pathname = usePathname();

  const [user, setUser] = useState(null);

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

  useEffect(() => {
    getUser();
  }, []);

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
      name: "Staff",
      href: "/staff",
      icon: UserCog,
      roles: ["Admin"],
    },
  ];

  const filteredLinks = user
    ? navLinks.filter((link) => link.roles.includes(user.position))
    : [];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div
        className="
          md:hidden
          fixed top-0 left-0
          w-full
          z-40

          px-4 py-3

          flex items-center justify-between
        "
        style={{
          backgroundColor: "var(--color-surface-primary)",
          borderBottom: "1px solid var(--color-border-light)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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
          className="
            w-10 h-10
            rounded-xl

            flex items-center justify-center

            transition-all duration-200
          "
          style={{
            backgroundColor: "var(--color-surface-secondary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0
          z-30

          h-screen
          w-72

          transition-transform duration-300 ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0
        `}
        style={{
          backgroundColor: "var(--color-surface-secondary)",
          borderRight: "1px solid var(--color-border-default)",
        }}
      >
        {/* LOGO */}
        <div
          className="
            h-20
            flex items-center
            px-6
          "
          style={{
            borderBottom: "1px solid var(--color-border-light)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-9 h-9
                rounded-xl

                flex items-center justify-center
                

                font-bold text-sm
              "
              style={{
                backgroundColor: "var(--color-primary-active)",
                
                
              }}
            >
              <i>ER</i>
            </div>

            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Flow
            </h1>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 flex flex-col gap-2">
          {filteredLinks.map((link) => {
            const NavIcon = link.icon;

            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="
                  px-4 py-3
                  rounded-2xl

                  flex items-center gap-3

                  text-sm font-medium

                  transition-all duration-200
                "
                style={{
                  color: isActive
                    ? "var(--color-primary-active)"
                    : "var(--color-text-primary)",

                  backgroundColor: isActive
                    ? "color-mix(in srgb, var(--color-primary) 18%, transparent)"
                    : "transparent",

                  border: isActive
                    ? "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)"
                    : "1px solid transparent",
                }}
              >
                <NavIcon size={18} />

                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div
          className="
            absolute bottom-0 left-0
            w-full
            p-4
          "
          style={{
            borderTop: "1px solid var(--color-border-light)",
            backgroundColor: "var(--color-surface-primary)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Emergency Room Dashboard
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ERFlow v1.0
          </p>

          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Logged in as: {user?.position || "Loading..."}
          </p>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed inset-0
            z-20
            md:hidden
          "
          style={{
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />
      )}
    </>
  );
}
