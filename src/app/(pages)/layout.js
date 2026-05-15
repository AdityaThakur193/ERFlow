import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ToastProvider from "@/components/providors/ToastProvider";
import Providers from "@/components/Providors";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <div
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        min-h-screen
        antialiased
        transition-colors duration-300
      `}
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <Providers>
        <ToastProvider />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Layout */}
        <div
          className="
            min-h-screen
            flex flex-col

            md:pl-72
          "
        >
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main
            className="
              flex-1

              w-full
              max-w-full

              p-4 md:p-6

              pt-20 md:pt-6

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
              color: "var(--color-text-secondary)",
            }}
            className="
              border-t

              px-4 md:px-6
              py-4

              text-sm
            "
          >
            ERFlow Emergency Dashboard • Real-Time Hospital Monitoring System
          </footer>
        </div>
      </Providers>
    </div>
  );
}
