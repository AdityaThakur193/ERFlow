// to fix hydration errors
"use client";

import { ThemeProvider } from "@/hooks/useTheme";

export default function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
