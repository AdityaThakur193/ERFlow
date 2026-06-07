"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { subscribe } from "./CustomToast";

export default function CustomToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === "dismiss") {
        setToasts((prev) => prev.filter((t) => t.id !== event.id));
      } else {
        // Prevent duplicate IDs
        setToasts((prev) => [...prev.filter((t) => t.id !== event.id), event]);

        // Auto-dismiss timeout
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== event.id));
        }, event.duration);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded border-2 shadow-md relative overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface-primary)",
                borderColor: isSuccess ? "var(--color-success)" : isError ? "var(--color-danger)" : "var(--color-border-strong)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {/* Colored status indicator line */}
              <div 
                className="absolute top-0 bottom-0 left-0 w-1"
                style={{
                  backgroundColor: isSuccess ? "var(--color-success)" : isError ? "var(--color-danger)" : "var(--color-accent)",
                }}
              />

              <div className="shrink-0 mt-0.5 ml-1">
                {isSuccess && <CheckCircle2 size={16} className="text-[var(--color-success)]" />}
                {isError && <AlertTriangle size={16} className="text-[var(--color-danger)]" />}
                {toast.type === "info" && <Info size={16} className="text-[var(--color-info)]" />}
              </div>

              <div className="flex-1 text-xs font-semibold leading-relaxed font-sans text-left pr-4">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
