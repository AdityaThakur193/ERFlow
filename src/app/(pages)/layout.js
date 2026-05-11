import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "ERFlow",
  description: "Smart Emergency Room Priority Board",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-zinc-100 text-black">
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
            className="
              border-t border-zinc-200
              bg-white
              px-4 md:px-6
              py-4
              text-sm text-zinc-500
            "
          >
            ERFlow Emergency Dashboard • Real-Time Hospital Monitoring System
          </footer>
        </div>
      </body>
    </html>
  );
}
