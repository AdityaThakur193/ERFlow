"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import AssignDoctorModal from "@/components/patients/AssignDoctorModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

function PatientsPageInner() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm }

  const searchParams = useSearchParams();

  useEffect(() => {
    const f = searchParams.get("filter");
    if (f === "Critical" || f === "High" || f === "Medium" || f === "Low") {
      setPriorityFilter(f);
    } else if (f === "Waiting" || f === "In treatment") {
      setStatusFilter(f);
    }
  }, [searchParams]);

  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");
      const data = await response.json();
      setPatients(data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }

  async function getUser() {
    try {
      const response = await fetch("/api/me");
      const data = await response.json();
      if (data.success) setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    getPatients();
    getUser();
  }, []);

  async function deletePatient(id) {
    try {
      const response = await fetch("/api/addpatient", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) getPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  }

  async function updateStatus(id, status) {
    try {
      const response = await fetch("/api/addpatient", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (data.success) getPatients();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (user?.position === "Doctor") {
        const safeDoctors = Array.isArray(patient.doctor)
          ? patient.doctor
          : patient.doctor ? [patient.doctor] : [];
        const isMyPatient = safeDoctors.some((doc) => {
          if (doc.userId && user.id && String(doc.userId) === String(user.id)) return true;
          return doc?.name?.toLowerCase() === (user.username || "").toLowerCase();
        });
        if (!isMyPatient) return false;
      }
      const matchesSearch =
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === "All" ? true : patient.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" ? true : patient.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [patients, search, priorityFilter, statusFilter, user]);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Critical": return "badge-critical";
      case "High":     return "badge-warning";
      case "Medium":   return "badge-medium";
      default:         return "badge-low";
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirm Modal */}
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />

      {/* Doctor-only info banner */}
      {user?.position === "Doctor" && (
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-3 border"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-info) 10%, transparent)",
            borderColor: "color-mix(in srgb, var(--color-info) 20%, transparent)",
          }}
        >
          <span style={{ color: "var(--color-info)", fontSize: "1.1rem" }}>🩺</span>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Showing your patients only.</strong>{" "}
            For equipment assignment and priority stats, use your{" "}
            <a href="/doctor-dashboard" style={{ color: "var(--color-info)", fontWeight: 600, textDecoration: "underline" }}>Doctor Dashboard</a>.
          </p>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Search Patients</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-tertiary)" }} />
              <input
                type="text"
                placeholder="Search by name or symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>
          <div>
            <label className="label">Filter by Priority</label>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="select">
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="label">Filter by Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select">
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In treatment">In Treatment</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Patient Registry</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredPatients.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block table-container" style={{ border: "none", borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Age / Gender</th>
                    <th>Priority</th>
                    <th>Department</th>
                    <th>Symptoms</th>
                    <th>Assigned Doctors</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id}>
                      {/* Name */}
                      <td>
                        <div>
                          <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{patient.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                            ID: {String(patient._id).substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td>
                        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {patient.age} yrs &middot; {patient.gender}
                        </span>
                      </td>

                      {/* Priority */}
                      <td>
                        <span className={`badge ${getPriorityBadgeClass(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>

                      {/* Department */}
                      <td>
                        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {patient.department || "—"}
                        </span>
                      </td>

                      {/* Symptoms */}
                      <td>
                        <span className="block max-w-xs truncate" title={patient.symptoms} style={{ color: "var(--color-text-secondary)" }}>
                          {patient.symptoms}
                        </span>
                      </td>

                      {/* Assigned Doctor */}
                      <td>
                        <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {patient.doctor && patient.doctor.length > 0
                            ? (Array.isArray(patient.doctor) ? patient.doctor.map((d) => d.name).join(", ") : patient.doctor.name)
                            : "Unassigned"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`badge ${patient.status === "Waiting" ? "badge-busy" : "badge-active"}`}>
                          {patient.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-2">
                          {patient.status !== "Completed" && (
                            <AssignDoctorModal
                              patientId={patient._id}
                              patientDepartment={patient.department}
                              assignedDoctors={patient.doctor || []}
                              onAssigned={getPatients}
                            />
                          )}
                          {patient.status !== "Completed" && (
                            <button
                              onClick={() => setConfirm({
                                title: "Complete Treatment",
                                message: `Mark treatment for ${patient.name} as completed?`,
                                confirmLabel: "Complete",
                                isDanger: false,
                                onConfirm: () => updateStatus(patient._id, "Completed"),
                              })}
                              className="btn btn-secondary text-xs py-1 px-2"
                            >
                              Complete
                            </button>
                          )}

                          {/* Delete — Admin only */}
                          {user?.position === "Admin" && (
                            <button
                              onClick={() => setConfirm({
                                title: "Delete Patient",
                                message: `Remove ${patient.name} from the system? This will also free up their assigned doctors and equipment.`,
                                confirmLabel: "Delete",
                                isDanger: true,
                                onConfirm: () => deletePatient(patient._id),
                              })}
                              className="btn-icon"
                              title="Delete patient"
                              aria-label="Delete patient"
                            >
                              <Trash2 size={15} color="var(--color-danger)" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-[var(--color-border-light)]">
              {filteredPatients.map((patient) => (
                <div key={patient._id} className="p-4 space-y-3 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "var(--color-text-primary)" }}>{patient.name}</h3>
                      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                        ID: {String(patient._id).substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`badge ${getPriorityBadgeClass(patient.priority)}`}>
                      {patient.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Age / Gender:</span>
                      <p className="mt-0.5">{patient.age} yrs · {patient.gender}</p>
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Department:</span>
                      <p className="mt-0.5">{patient.department || "—"}</p>
                    </div>
                  </div>

                  <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Symptoms:</span>
                    <p className="mt-0.5 leading-relaxed">{patient.symptoms}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2.5 border-t border-[var(--color-border-light)] text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold block text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>Assigned Doctor:</span>
                        <p className="font-semibold text-xs mt-0.5" style={{ color: "var(--color-text-primary)" }}>
                          {patient.doctor && patient.doctor.length > 0
                            ? (Array.isArray(patient.doctor) ? patient.doctor.map((d) => d.name).join(", ") : patient.doctor.name)
                            : "Unassigned"}
                        </p>
                      </div>
                      <div>
                        <span className={`badge ${patient.status === "Waiting" ? "badge-busy" : "badge-active"}`}>
                          {patient.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {patient.status !== "Completed" && (
                        <AssignDoctorModal
                          patientId={patient._id}
                          patientDepartment={patient.department}
                          assignedDoctors={patient.doctor || []}
                          onAssigned={getPatients}
                        />
                      )}
                      {patient.status !== "Completed" && (
                        <button
                          onClick={() => setConfirm({
                            title: "Complete Treatment",
                            message: `Mark treatment for ${patient.name} as completed?`,
                            confirmLabel: "Complete",
                            isDanger: false,
                            onConfirm: () => updateStatus(patient._id, "Completed"),
                          })}
                          className="btn btn-secondary text-xs py-1.5 px-2.5"
                        >
                          Complete
                        </button>
                      )}
                      {user?.position === "Admin" && (
                        <button
                          onClick={() => setConfirm({
                            title: "Delete Patient",
                            message: `Remove ${patient.name} from the system? This will also free up their assigned doctors and equipment.`,
                            confirmLabel: "Delete",
                            isDanger: true,
                            onConfirm: () => deletePatient(patient._id),
                          })}
                          className="btn-icon"
                          title="Delete patient"
                          aria-label="Delete patient"
                        >
                          <Trash2 size={15} color="var(--color-danger)" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              {search || priorityFilter !== "All" || statusFilter !== "All"
                ? "No patients match your search filters"
                : "No patients registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense>
      <PatientsPageInner />
    </Suspense>
  );
}