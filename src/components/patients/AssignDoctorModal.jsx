"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Stethoscope, Search, UserMinus } from "lucide-react";

export default function AssignDoctorModal({ patientId, patientDepartment, assignedDoctors = [], onAssigned }) {
  const [isOpen, setIsOpen] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(null); // track which doctor is being assigned
  const [unassigning, setUnassigning] = useState(null);

  async function fetchDoctors() {
    try {
      const res = await fetch("/api/adddoctor");
      const data = await res.json();
      if (data.success) {
        setAllDoctors(data.data || []);
      }
    } catch (error) {
      console.error("FETCH DOCTORS ERROR:", error);
      toast.error("Failed to load doctors");
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
      setSearch("");
    }
  }, [isOpen]);

  // Ensure assignedDoctors is an array (handles old cached schema returning single object)
  const safeAssigned = Array.isArray(assignedDoctors) ? assignedDoctors : (assignedDoctors ? [assignedDoctors] : []);
  
  // IDs of already-assigned doctors for quick lookup
  const assignedIds = new Set(safeAssigned.map((d) => d && (d._id?.toString() || d.toString())).filter(Boolean));

  // Filter: search + exclude already-assigned + prefer matching department
  const filteredDoctors = allDoctors
    .filter((doc) => {
      const q = search.toLowerCase();
      const matchesSearch =
        doc.name.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q) ||
        doc.roomNumber.toLowerCase().includes(q);
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort: matching department first, then Available before busy, then alphabetical
      const aDeptMatch = a.department === patientDepartment ? 0 : 1;
      const bDeptMatch = b.department === patientDepartment ? 0 : 1;
      if (aDeptMatch !== bDeptMatch) return aDeptMatch - bDeptMatch;
      const aAvail = a.status === "Available" ? 0 : 1;
      const bAvail = b.status === "Available" ? 0 : 1;
      if (aAvail !== bAvail) return aAvail - bAvail;
      return a.name.localeCompare(b.name);
    });

  async function handleAssign(doctorId) {
    setAssigning(doctorId);
    try {
      const res = await fetch("/api/assign-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, doctorId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Doctor assigned!");
        if (onAssigned) onAssigned();
        fetchDoctors(); // refresh doctor statuses in modal
      } else {
        toast.error(data.message || "Failed to assign doctor");
      }
    } catch (error) {
      console.error("ASSIGN DOCTOR ERROR:", error);
      toast.error("An error occurred");
    } finally {
      setAssigning(null);
    }
  }

  async function handleUnassign(doctorId) {
    setUnassigning(doctorId);
    try {
      const res = await fetch("/api/assign-doctor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, doctorId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Doctor removed from patient");
        if (onAssigned) onAssigned();
        fetchDoctors();
      } else {
        toast.error(data.message || "Failed to unassign doctor");
      }
    } catch (error) {
      console.error("UNASSIGN DOCTOR ERROR:", error);
      toast.error("An error occurred");
    } finally {
      setUnassigning(null);
    }
  }

  const getStatusColor = (status) => {
    if (status === "Available") return "var(--color-success)";
    if (status === "busy") return "var(--color-warning)";
    return "var(--color-text-tertiary)";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary text-xs py-1.5 flex items-center gap-1"
      >
        <Stethoscope size={14} />
        {safeAssigned.length > 0 ? "Manage Doctors" : "Assign Doctor"}
      </button>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            {/* Header */}
            <div className="modal-header flex items-start justify-between">
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Manage Assigned Doctors
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {patientDepartment && (
                    <span>Patient department: <strong>{patientDepartment}</strong> · </span>
                  )}
                  {safeAssigned.length} doctor{safeAssigned.length !== 1 ? "s" : ""} currently assigned
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-icon ml-auto"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body space-y-4">
              {/* Currently Assigned Doctors */}
              {safeAssigned.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-text-secondary)" }}>
                    Currently Assigned
                  </p>
                  <div className="space-y-2">
                    {safeAssigned.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)",
                        }}
                      >
                        <div>
                          <p className="font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>
                            Dr. {doc.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                            {doc.specialization} · {doc.department} · Room {doc.roomNumber}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnassign(doc._id)}
                          disabled={unassigning === doc._id}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                          style={{
                            color: "var(--color-danger)",
                            backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                          }}
                        >
                          <UserMinus size={12} />
                          {unassigning === doc._id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--color-text-secondary)" }}>
                  Add Doctor
                </p>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-text-tertiary)" }}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, specialization, department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input pl-9"
                  />
                </div>
              </div>

              {/* Doctor List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredDoctors.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: "var(--color-text-tertiary)" }}>
                    No doctors found
                  </p>
                ) : (
                  filteredDoctors.map((doc) => {
                    const isAssigned = assignedIds.has(doc._id);
                    const isDeptMatch = doc.department === patientDepartment;
                    return (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-3 rounded-xl transition-colors"
                        style={{
                          backgroundColor: isAssigned
                            ? "color-mix(in srgb, var(--color-primary) 8%, transparent)"
                            : "var(--color-surface-secondary)",
                          border: `1px solid ${isAssigned
                            ? "color-mix(in srgb, var(--color-primary) 20%, transparent)"
                            : "var(--color-border-light)"}`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>
                              Dr. {doc.name}
                            </p>
                            {isDeptMatch && (
                              <span className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--color-success) 15%, transparent)",
                                  color: "var(--color-success)",
                                }}>
                                Dept Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                            {doc.specialization} · {doc.department} · Room {doc.roomNumber}
                          </p>
                          <p className="text-xs mt-0.5 font-medium" style={{ color: getStatusColor(doc.status) }}>
                            ● {doc.status === "busy" ? "Busy" : doc.status}
                            {doc.patients?.length > 0 && ` (${doc.patients.length} patient${doc.patients.length !== 1 ? "s" : ""})`}
                          </p>
                        </div>
                        <div className="ml-3">
                          {isAssigned ? (
                            <span className="text-xs px-2 py-1 rounded-lg"
                              style={{ color: "var(--color-primary)", backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}>
                              ✓ Assigned
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAssign(doc._id)}
                              disabled={assigning === doc._id}
                              className="btn btn-primary text-xs py-1.5 px-3"
                            >
                              {assigning === doc._id ? "Adding..." : "Assign"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button onClick={() => setIsOpen(false)} className="btn btn-secondary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
