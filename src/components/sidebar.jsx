"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Patients",
      href: "/patients",
    },
    {
      name: "Doctors",
      href: "/doctors",
    },
    {
      name: "Equipment",
      href: "/equipment",
    },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-black text-lg font-semibold">ERFlow</h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-black text-2xl"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-72
          bg-white text-black border-r border-zinc-200
          transition-transform duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 border-b border-zinc-200 flex items-center px-6">
          <h1 className="text-2xl font-bold text-black">ERFlow</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="
                px-4 py-3 rounded-xl
                text-black
                hover:bg-zinc-100
                transition-all
              "
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 p-4">
          <p className="text-sm text-zinc-600">Emergency Room Dashboard</p>

          <p className="text-xs text-zinc-400 mt-1">ERFlow v1.0</p>
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
