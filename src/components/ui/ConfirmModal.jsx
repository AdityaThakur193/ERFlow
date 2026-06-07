"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ConfirmModal – replaces native window.confirm() with a branded in-app dialog.
 * Teleported to document.body to bypass parent overflow & transform styling.
 */
export default function ConfirmModal({ state, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scrolling on document body when modal is open
  useEffect(() => {
    if (state) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  if (!state) return null;

  const { title, message, onConfirm, confirmLabel = "Delete", isDanger = true } = state;

  function handleConfirm() {
    onConfirm?.();
    onClose();
  }

  const modalJSX = (
    <AnimatePresence>
      {state && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            style={{ maxWidth: "26rem" }}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isDanger
                      ? "color-mix(in srgb, var(--color-danger) 12%, transparent)"
                      : "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                    color: isDanger ? "var(--color-danger)" : "var(--color-primary)",
                  }}
                >
                  <AlertTriangle size={16} />
                </div>
                <h2
                  className="text-base font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="btn-icon ml-2 shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button onClick={onClose} className="btn btn-secondary text-sm">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`btn text-sm ${isDanger ? "btn-danger" : "btn-primary"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalJSX, document.body);
}
