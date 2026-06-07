"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Minus,
  ArrowDown,
  CheckCircle2,
  Stethoscope,
  Wrench,
  User,
  Building2,
  RefreshCw,
  Circle,
} from "lucide-react";
import { toast } from "@/components/providors/CustomToast";
import ConfirmModal from "@/components/ui/ConfirmModal";

// ── Priority config ────────────────────────────────────────────────────────
const PRIORITY = {
  Critical: {
    icon: AlertTriangle,
    color: "var(--color-danger)",
    bg: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
    border: "color-mix(in srgb, var(--color-danger) 22%, transparent)",
    badge: "badge-critical",
  },
  High: {
    icon: TrendingUp,
    color: "var(--color-warning)",
    bg: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
    border: "color-mix(in srgb, var(--color-warning) 22%, transparent)",
    badge: "badge-warning",
  },
  Medium: {
    icon: Minus,
    color: "var(--color-info)",
    bg: "color-mix(in srgb, var(--color-info) 12%, transparent)",
    border: "color-mix(in srgb, var(--color-info) 22%, transparent)",
    badge: "badge-medium",
  },
  Low: {
    icon: ArrowDown,
    color: "var(--color-success)",
    bg: "color-mix(in srgb, var(--color-success) 12%, transparent)",
    border: "color-mix(in srgb, var(--color-success) 22%, transparent)",
    badge: "badge-low",
  },
};

const STATUS_BADGE = {
  Waiting: "badge-busy",
  "In treatment": "badge-active",
  Completed: "badge-low",
};

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigningEquip, setAssigningEquip] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [confirm, setConfirm] = useState(null);

  // ── Fetch all dashboard data ──────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctor-dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        toast.error(json.message || "Failed to load dashboard");
      }
    } catch {
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Mark patient as completed ─────────────────────────────────────────────
  async function completePatient(patientId) {
    try {
      const res = await fetch("/api/addpatient", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patientId, status: "Completed" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Patient marked as completed");
        fetchDashboard();
      } else {
        toast.error(json.message || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  // ── Assign equipment to a patient ─────────────────────────────────────────
  async function assignEquipment(equipId) {
    if (!selectedPatient) {
      toast.error("Select a patient first");
      return;
    }
    setAssigningEquip(equipId);
    try {
      const res = await fetch("/api/addequipment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: equipId,
          action: "assign",
          assignedPatient: selectedPatient,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Equipment assigned successfully");
        setSelectedPatient("");
        fetchDashboard();
      } else {
        toast.error(json.message || "Failed to assign equipment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAssigningEquip(null);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-text-tertiary)" }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-12 text-center">
        <Stethoscope size={40} className="mx-auto mb-3" style={{ color: "var(--color-text-disabled)" }} />
        <p className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          No doctor profile linked to your account
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-tertiary)" }}>
          Ask your admin to register you in the Doctors list using the same name as your username.
        </p>
      </div>
    );
  }

  const { doctor, activePatients, completedCount, priorityCounts, equipment } = data;

  // Sort patients: Critical first
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const sortedPatients = [...activePatients].sort(
    (a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4)
  );

  return (
    <div className="space-y-6">
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />

      {/* ── Doctor Profile Card ─────────────────────────────────────────── */}
      <div
        className="card p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{
              background: "color-mix(in srgb, var(--color-primary) 18%, transparent)",
              color: "var(--color-primary-active)",
              border: "2px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
            }}
          >
            {doctor.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Dr. {doctor.name}
            </h1>
            <div className="flex flex-wrap gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                <Stethoscope size={14} style={{ color: "var(--color-primary-active)" }} />
                {doctor.specialization}
              </span>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                <Building2 size={14} style={{ color: "var(--color-info)" }} />
                {doctor.department}
              </span>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                <User size={14} style={{ color: "var(--color-text-tertiary)" }} />
                Room {doctor.roomNumber}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="badge"
            style={{
              backgroundColor: doctor.status === "Available"
                ? "color-mix(in srgb, var(--color-success) 15%, transparent)"
                : doctor.status === "busy"
                ? "color-mix(in srgb, var(--color-warning) 15%, transparent)"
                : "color-mix(in srgb, var(--color-text-tertiary) 15%, transparent)",
              color: doctor.status === "Available"
                ? "var(--color-success)"
                : doctor.status === "busy"
                ? "var(--color-warning)"
                : "var(--color-text-tertiary)",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
            }}
          >
            <Circle size={8} fill="currentColor" className="inline mr-1" />
            {doctor.status}
          </span>
          <button
            onClick={fetchDashboard}
            className="btn-icon"
            title="Refresh"
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={16} style={{ color: "var(--color-text-tertiary)" }} />
          </button>
        </div>
      </div>

      {/* ── Priority Stats Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {["Critical", "High", "Medium", "Low"].map((level) => {
          const cfg = PRIORITY[level];
          const Icon = cfg.icon;
          return (
            <div
              key={level}
              className="card p-5 flex flex-col gap-2"
              style={{
                backgroundColor: cfg.bg,
                borderColor: cfg.border,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: cfg.color }}>
                  {level}
                </span>
                <Icon size={18} style={{ color: cfg.color }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: cfg.color }}>
                {priorityCounts[level]}
              </p>
              <p className="text-xs" style={{ color: cfg.color, opacity: 0.7 }}>
                active patient{priorityCounts[level] !== 1 ? "s" : ""}
              </p>
            </div>
          );
        })}

        {/* Completed card */}
        <div
          className="card p-5 flex flex-col gap-2"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-primary))",
            borderColor: "var(--color-primary)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary-active)" }}>
              Treated
            </span>
            <CheckCircle2 size={18} style={{ color: "var(--color-primary-active)" }} />
          </div>
          <p className="text-3xl font-bold" style={{ color: "var(--color-primary-active)" }}>
            {completedCount}
          </p>
          <p className="text-xs" style={{ color: "var(--color-primary-active)", opacity: 0.7 }}>
            completed total
          </p>
        </div>
      </div>

      {/* ── My Active Patients Table ────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div
          className="p-6 flex items-center justify-between border-b"
          style={{ borderColor: "var(--color-border-light)" }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
              My Active Patients
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {sortedPatients.length} patient{sortedPatients.length !== 1 ? "s" : ""} under your care
            </p>
          </div>
        </div>

        {sortedPatients.length > 0 ? (
          <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Priority</th>
                  <th>Age / Gender</th>
                  <th>Department</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.map((patient) => {
                  const pcfg = PRIORITY[patient.priority] || PRIORITY.Low;
                  return (
                    <tr key={patient._id}>
                      <td>
                        <div>
                          <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            {patient.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                            ID: {String(patient._id).substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge flex items-center gap-1.5 w-fit"
                          style={{
                            backgroundColor: pcfg.bg,
                            color: pcfg.color,
                          }}
                        >
                          <Circle size={8} fill="currentColor" />
                          {patient.priority}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                          {patient.age} yrs · {patient.gender}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                          {patient.department}
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-sm block max-w-[200px] truncate"
                          style={{ color: "var(--color-text-secondary)" }}
                          title={patient.symptoms}
                        >
                          {patient.symptoms}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[patient.status] || "badge-low"}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        {patient.status !== "Completed" && (
                          <button
                            onClick={() => setConfirm({
                              title: "Complete Treatment",
                              message: `Mark ${patient.name} as Completed? This will free up assigned resources.`,
                              confirmLabel: "Complete",
                              isDanger: false,
                              onConfirm: () => completePatient(patient._id),
                            })}
                            className="btn btn-secondary text-xs py-1.5"
                          >
                            <CheckCircle2 size={14} />
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Stethoscope size={40} className="mx-auto mb-3" style={{ color: "var(--color-text-disabled)" }} />
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
              No active patients assigned to you
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              A receptionist or admin will assign patients to you.
            </p>
          </div>
        )}
      </div>

      {/* ── Available Equipment ──────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div
          className="p-6 border-b"
          style={{ borderColor: "var(--color-border-light)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                <Wrench size={18} style={{ color: "var(--color-info)" }} />
                Available Equipment
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {equipment.length} item{equipment.length !== 1 ? "s" : ""} available · Select a patient to assign
              </p>
            </div>

            {/* Patient selector for equipment assignment */}
            {activePatients.length > 0 && (
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="select sm:w-64"
                id="equip-patient-select"
              >
                <option value="">— Pick a patient —</option>
                {sortedPatients
                  .filter((p) => p.status !== "Completed")
                  .map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.priority})
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>

        {equipment.length > 0 ? (
          <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Room</th>
                  <th>Stock</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                        {item.name}
                      </p>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--color-info) 12%, transparent)",
                          color: "var(--color-info)",
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        {item.roomNumber}
                      </span>
                    </td>
                    <td>
                      <span
                        className="font-semibold text-sm"
                        style={{
                          color: item.inventory > 2
                            ? "var(--color-success)"
                            : item.inventory > 0
                            ? "var(--color-warning)"
                            : "var(--color-danger)",
                        }}
                      >
                        {item.inventory} left
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => assignEquipment(item._id)}
                        disabled={!selectedPatient || assigningEquip === item._id}
                        className="btn btn-secondary text-xs py-1.5"
                        title={!selectedPatient ? "Select a patient first" : "Assign to selected patient"}
                      >
                        {assigningEquip === item._id ? "Assigning..." : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Wrench size={36} className="mx-auto mb-3" style={{ color: "var(--color-text-disabled)" }} />
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No equipment available right now
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
