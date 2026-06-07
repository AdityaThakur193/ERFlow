import "../globals.css";

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
        className="border-t px-4 md:px-6 py-5 text-xs text-center font-sans"
        style={{
          borderColor: "var(--color-border-light)",
          backgroundColor: "var(--color-surface-secondary)",
          color: "var(--color-text-tertiary)",
        }}
      >
        ERFlow &bull; Emergency Department Operations Platform
      </footer>
    </div>
  );
}
