import "../app/(public)/globals.css";

export const metadata = {
  title: "ERFlow",
  description: "Smart Emergency Room Priority Board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
