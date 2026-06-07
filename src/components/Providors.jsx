// to fix hydration errors
"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import Lenis from "lenis";
import CustomToastContainer from "./providors/CustomToastContainer";

export default function Providers({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <CustomToastContainer />
      {children}
    </ThemeProvider>
  );
}
