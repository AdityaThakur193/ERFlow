import "./globals.css";

export const metadata = {
  title: "ERFlow",
  description: "Smart Emergency Room Priority Board",
};

export default function RootLayout({ children }) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <div className="flex-1">{children}</div>

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
  );
}
