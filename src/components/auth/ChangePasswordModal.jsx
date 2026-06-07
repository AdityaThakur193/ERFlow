"use client";

import { useState } from "react";
import { toast } from "@/components/providors/CustomToast";
import { X, KeyRound, Eye, EyeOff, Check, ShieldCheck } from "lucide-react";

export default function ChangePasswordModal({ username, variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  function toggleShow(field) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setIsOpen(false);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShow({ current: false, new: false, confirm: false });
  }

  // Password strength helpers
  const strength = (() => {
    const p = form.newPassword;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score; // 0–4
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "var(--color-danger)",
    "var(--color-warning)",
    "var(--color-info)",
    "var(--color-success)",
  ][strength];

  const passwordsMatch =
    form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Password updated successfully!");
        handleClose();
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      {variant === "menuItem" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--color-text-primary)" }}
        >
          <KeyRound size={14} style={{ color: "var(--color-text-secondary)" }} />
          <span>Change Password</span>
        </button>
      ) : (
        <button
          id="change-password-btn"
          onClick={() => setIsOpen(true)}
          className="btn-icon shrink-0"
          title="Change your password"
          aria-label="Change password"
        >
          <KeyRound size={16} />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="modal-content" data-lenis-prevent style={{ maxWidth: "26rem" }}>
            {/* Header */}
            <div className="modal-header flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--color-primary) 14%, transparent)",
                  }}
                >
                  <ShieldCheck size={20} style={{ color: "var(--color-primary-active)" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Change Password
                  </h2>
                  {username && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                      {username}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={handleClose} className="btn-icon ml-4 shrink-0" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="flex flex-col gap-4">
                {/* Current password */}
                <PasswordField
                  id="cp-current"
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={form.currentPassword}
                  onChange={(v) => handleChange("currentPassword", v)}
                  show={show.current}
                  onToggle={() => toggleShow("current")}
                />

                <div
                  className="h-px w-full"
                  style={{ backgroundColor: "var(--color-border-light)" }}
                />

                {/* New password */}
                <PasswordField
                  id="cp-new"
                  label="New Password"
                  placeholder="Min. 6 characters"
                  value={form.newPassword}
                  onChange={(v) => handleChange("newPassword", v)}
                  show={show.new}
                  onToggle={() => toggleShow("new")}
                />

                {/* Strength bar */}
                {form.newPassword && (
                  <div className="-mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className="flex-1 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              strength >= s ? strengthColor : "var(--color-border-default)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </p>
                  </div>
                )}

                {/* Confirm new password */}
                <PasswordField
                  id="cp-confirm"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  value={form.confirmPassword}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  show={show.confirm}
                  onToggle={() => toggleShow("confirm")}
                  suffix={
                    form.confirmPassword ? (
                      passwordsMatch ? (
                        <Check size={15} style={{ color: "var(--color-success)" }} />
                      ) : (
                        <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>✗</span>
                      )
                    ) : null
                  }
                />
              </div>
            </form>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" onClick={handleClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? "Saving..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Reusable password input ────────────────────────────────────────────────
function PasswordField({ id, label, placeholder, value, onChange, show, onToggle, suffix }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1"
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.8rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pr-20"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {suffix && (
            <span className="flex items-center justify-center w-5">{suffix}</span>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="btn-icon"
            style={{ width: "2rem", height: "2rem" }}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? (
              <EyeOff size={14} style={{ color: "var(--color-text-tertiary)" }} />
            ) : (
              <Eye size={14} style={{ color: "var(--color-text-tertiary)" }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
