"use client";

import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import "../globals.css";

export default function PagesLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen antialiased transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <div className="min-h-screen flex">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Content Container (accounts for sidebar width on desktop) */}
        <div className="flex-1 flex flex-col min-h-screen md:pl-64">
          {/* Header Control Bar */}
          <Header onMenuToggle={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>

          {/* Footer */}
          <footer
            style={{
              borderColor: "var(--color-border-light)",
              backgroundColor: "var(--color-surface-secondary)",
              color: "var(--color-text-tertiary)",
            }}
            className="border-t px-6 py-5 text-xs font-sans text-center mt-auto"
          >
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>ERFlow v1.0</span>
              <span>Emergency Department Operations Platform &bull; Real-time Triage</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
