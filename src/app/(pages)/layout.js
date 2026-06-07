import "../globals.css";

import Header from "@/components/header";

export default function RootLayout({ children }) {
  return (
    <div
      className="
        min-h-screen
        antialiased
        transition-colors duration-300
      "
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Main Layout */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main
          className="
            flex-1
            w-full
            max-w-7xl
            mx-auto
            p-4 md:p-6
            overflow-x-hidden
          "
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            borderColor: "var(--color-border-light)",
            backgroundColor: "var(--color-surface-secondary)",
            color: "var(--color-text-tertiary)",
          }}
          className="border-t px-6 py-5 text-xs font-sans text-center"
        >
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>ERFlow v1.0</span>
            <span>Emergency Department Operations Platform &bull; Real-time Triage</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
