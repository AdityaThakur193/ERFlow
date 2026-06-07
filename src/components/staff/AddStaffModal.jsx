"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/providors/CustomToast";
import { X, Plus, Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";

// ── Password generator ────────────────────────────────────────────────────
const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

function generatePassword(length = 12) {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => CHARSET[n % CHARSET.length]).join("");
}
// ─────────────────────────────────────────────────────────────────────────

const EMPTY_FORM = (pwd) => ({
  username: "",
  email: "",
  password: pwd,
  position: "Receptionist",
  // Doctor-only fields
  specialization: "",
  department: "",
  roomNumber: "",
});

const positionColors = {
  Admin: "var(--color-danger)",
  Doctor: "var(--color-info)",
  Receptionist: "var(--color-success)",
};

export default function AddStaffModal({ onAdded, forcePosition }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM(""));
  const [departments, setDepartments] = useState([]);

  // ── Fetch departments for Doctor form ────────────────────────────────────
  useEffect(() => {
    if (isOpen && formData.position === "Doctor") {
      fetch("/api/departments")
        .then((r) => r.json())
        .then((d) => { if (d.success) setDepartments(d.data || []); })
        .catch(() => {});
    }
  }, [isOpen, formData.position]);

  // ── Regenerate password ──────────────────────────────────────────────────
  const regenerate = useCallback(() => {
    setFormData((prev) => ({ ...prev, password: generatePassword() }));
    setCopied(false);
  }, []);

  // ── Open / Close ─────────────────────────────────────────────────────────
  function handleOpen() {
    const defaultForm = EMPTY_FORM(generatePassword());
    if (forcePosition) {
      defaultForm.position = forcePosition;
    }
    setFormData(defaultForm);
    setShowPassword(true);
    setCopied(false);
    setDepartments([]);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setCopied(false);
  }

  function copyPassword() {
    navigator.clipboard.writeText(formData.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handlePositionChange(pos) {
    setFormData((prev) => ({
      ...prev,
      position: pos,
      specialization: "",
      department: "",
      roomNumber: "",
    }));
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.position) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.position === "Doctor") {
      if (!formData.specialization || !formData.department || !formData.roomNumber) {
        toast.error("Specialization, department, and room number are required for doctors");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(
          formData.position === "Doctor"
            ? "Doctor account & profile created!"
            : `${formData.position} account created successfully`
        );
        if (onAdded) onAdded();
        handleClose();
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const labelStyle = {
    color: "var(--color-text-secondary)",
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <>
      <button
        id="add-staff-btn"
        onClick={handleOpen}
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus size={18} />
        <span>{forcePosition === "Doctor" ? "Add Doctor" : "Add Staff"}</span>
      </button>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="modal-content" data-lenis-prevent style={{ maxWidth: "32rem" }}>
            {/* Header */}
            <div className="modal-header flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                  {forcePosition === "Doctor" ? "Register Doctor" : "Create Staff Account"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  A secure password is auto-generated. Copy and share it with the staff member.
                </p>
              </div>
              <button onClick={handleClose} className="btn-icon ml-4 shrink-0" aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="flex flex-col gap-5">

                {/* Role picker */}
                {!forcePosition && (
                  <div>
                    <label className="block mb-2" style={labelStyle}>Role / Position</label>
                    <div className="flex gap-3">
                      {["Receptionist", "Doctor", "Admin"].map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => handlePositionChange(pos)}
                          className="flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all duration-200"
                          style={{
                            backgroundColor: formData.position === pos
                              ? `color-mix(in srgb, ${positionColors[pos]} 15%, transparent)`
                              : "var(--color-surface-secondary)",
                            borderColor: formData.position === pos
                              ? positionColors[pos]
                              : "var(--color-border-default)",
                            color: formData.position === pos
                              ? positionColors[pos]
                              : "var(--color-text-secondary)",
                          }}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Username */}
                <div>
                  <label htmlFor="staff-username" className="block mb-1" style={labelStyle}>
                    {formData.position === "Doctor" ? "Full Name (used as doctor profile name)" : "Username"}
                  </label>
                  <input
                    id="staff-username"
                    type="text"
                    required
                    placeholder={formData.position === "Doctor" ? "e.g. Sarah Mitchell" : "e.g. front_desk_1"}
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="input"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="staff-email" className="block mb-1" style={labelStyle}>Email</label>
                  <input
                    id="staff-email"
                    type="email"
                    required
                    placeholder="staff@hospital.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="input"
                  />
                </div>

                {/* ── Doctor-only fields ── */}
                {formData.position === "Doctor" && (
                  <div
                    className="rounded-xl p-4 flex flex-col gap-4"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--color-info) 8%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--color-info) 20%, transparent)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-info)" }}>
                      Doctor Profile Details
                    </p>

                    <div>
                      <label htmlFor="staff-spec" className="block mb-1" style={labelStyle}>Specialization</label>
                      <input
                        id="staff-spec"
                        type="text"
                        required
                        placeholder="e.g. Emergency Medicine"
                        value={formData.specialization}
                        onChange={(e) => handleChange("specialization", e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label htmlFor="staff-dept" className="block mb-1" style={labelStyle}>Department</label>
                      {departments.length > 0 ? (
                        <select
                          id="staff-dept"
                          value={formData.department}
                          onChange={(e) => handleChange("department", e.target.value)}
                          className="select"
                          required
                        >
                          <option value="">— Select department —</option>
                          {departments.map((d) => (
                            <option key={d._id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="staff-dept"
                          type="text"
                          required
                          placeholder="e.g. Cardiology"
                          value={formData.department}
                          onChange={(e) => handleChange("department", e.target.value)}
                          className="input"
                        />
                      )}
                    </div>

                    <div>
                      <label htmlFor="staff-room" className="block mb-1" style={labelStyle}>Room / Station</label>
                      <input
                        id="staff-room"
                        type="text"
                        required
                        placeholder="e.g. ER-101"
                        value={formData.roomNumber}
                        onChange={(e) => handleChange("roomNumber", e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                )}

                {/* Auto-generated password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block" style={labelStyle}>Generated Password</label>
                    <button
                      type="button"
                      onClick={regenerate}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                      style={{
                        color: "var(--color-primary-active)",
                        backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)",
                      }}
                    >
                      <RefreshCw size={12} />
                      Regenerate
                    </button>
                  </div>

                  <div
                    className="flex items-center justify-between rounded-xl px-4 py-3 gap-3"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      border: "1px solid var(--color-border-default)",
                    }}
                  >
                    <code className="flex-1 text-sm font-mono tracking-wide break-all" style={{ color: "var(--color-text-primary)" }}>
                      {showPassword ? formData.password : "•".repeat(formData.password.length)}
                    </code>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="btn-icon" style={{ width: "2rem", height: "2rem" }} aria-label="Toggle visibility">
                        {showPassword ? <EyeOff size={14} style={{ color: "var(--color-text-tertiary)" }} /> : <Eye size={14} style={{ color: "var(--color-text-tertiary)" }} />}
                      </button>
                      <button type="button" onClick={copyPassword} className="btn-icon" style={{ width: "2rem", height: "2rem" }} aria-label="Copy password">
                        {copied ? <Check size={14} style={{ color: "var(--color-success)" }} /> : <Copy size={14} style={{ color: "var(--color-text-tertiary)" }} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: copied ? "var(--color-success)" : "var(--color-text-tertiary)" }}>
                    {copied ? "✓ Copied to clipboard!" : "📋 Copy this before closing — it won't be shown again."}
                  </p>
                </div>

              </div>
            </form>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? "Creating..." : `Create ${formData.position}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
