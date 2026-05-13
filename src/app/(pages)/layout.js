"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/hooks/useTheme";

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        style={{
          backgroundColor: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
        }}
        className="min-h-screen transition-colors duration-200"
      >
        <ThemeProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div
            className="
              md:ml-72
              min-h-screen
              flex flex-col
              pt-14 md:pt-0
            "
          >
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main
              className="
                flex-1
                p-4 md:p-6
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
              className="border-t px-4 md:px-6 py-4 text-sm transition-colors duration-200"
            >
              ERFlow Emergency Dashboard • Real-Time Hospital Monitoring System
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
