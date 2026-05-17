"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import AssignDoctorModal from "@/components/patients/AssignDoctorModal";

function PatientsPageInner() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [user, setUser] = useState(null);

  const searchParams = useSearchParams();

  // Read filter from dashboard click-throughs
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
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    getPatients();
    getUser();
  }, []);

  async function deletePatient(id) {
    if (!confirm("Delete this patient? This will also free up their assigned doctors and equipment.")) return;
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
      const matchesSearch =
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === "All" ? true : patient.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" ? true : patient.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [patients, search, priorityFilter, statusFilter]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical": return "badge-critical";
      case "High": return "badge-high";
      case "Medium": return "badge-medium";
      default: return "badge-low";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Search Patients</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3" style={{ color: "var(--color-text-tertiary)" }} />
              <input
                type="text"
                placeholder="Search by name or symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
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
          <div className="table-container">
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
                        <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>{patient.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                          ID: {String(patient._id).substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td>
                      <span style={{ color: "var(--color-text-primary)" }}>
                        {patient.age} yrs · {patient.gender}
                      </span>
                    </td>

                    {/* Priority */}
                    <td>
                      <span className={`badge ${getPriorityBadge(patient.priority)}`}>{patient.priority}</span>
                    </td>

                    {/* Department */}
                    <td>
                      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        {patient.department}
                      </span>
                    </td>

                    {/* Symptoms */}
                    <td>
                      <span className="text-sm max-w-xs truncate block" style={{ color: "var(--color-text-secondary)" }}>
                        {patient.symptoms}
                      </span>
                    </td>

                    {/* ⭐ Assigned Doctors - now an array */}
                    <td>
                      {(() => {
                        const safeDoctors = Array.isArray(patient.doctor) ? patient.doctor : (patient.doctor ? [patient.doctor] : []);
                        return safeDoctors.length > 0 ? (
                          <div className="space-y-1">
                            {safeDoctors.map((doc) => (
                              <div key={doc._id}>
                                <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                                  Dr. {doc.name}
                                </p>
                                <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                                  {doc.department} · {doc.specialization}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm font-medium" style={{ color: "var(--color-warning)" }}>
                            ⊘ Unassigned
                          </span>
                        );
                      })()}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${
                        patient.status === "Waiting" ? "badge-busy" :
                        patient.status === "In treatment" ? "badge-active" :
                        "badge-low"
                      }`}>
                        {patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {/* Manage Doctors - Admin & Receptionist */}
                        {patient.status !== "Completed" && (user?.position === "Admin" || user?.position === "Receptionist") && (
                          <AssignDoctorModal
                            patientId={patient._id}
                            patientDepartment={patient.department}
                            assignedDoctors={patient.doctor || []}
                            onAssigned={getPatients}
                          />
                        )}

                        {/* Complete button - Admin & Assigned Doctor */}
                        {patient.doctor?.length > 0 && patient.status !== "Completed" && (
                          user?.position === "Admin" || (
                            user?.position === "Doctor" &&
                            patient.doctor.some((doc) => user?.username?.toLowerCase().includes(doc.name.toLowerCase()))
                          )
                        ) && (
                          <button
                            onClick={() => updateStatus(patient._id, "Completed")}
                            className="btn btn-secondary text-xs py-1.5"
                          >
                            Complete
                          </button>
                        )}

                        {/* Delete - Admin only */}
                        {user?.position === "Admin" && (
                          <button
                            onClick={() => deletePatient(patient._id)}
                            className="btn btn-icon"
                            title="Delete patient"
                            aria-label="Delete patient"
                          >
                            <Trash2 size={16} style={{ color: "var(--color-danger)" }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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