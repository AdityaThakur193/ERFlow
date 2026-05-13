"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import AssignDoctorModal from "@/components/patients/AssignDoctorModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");
      const data = await response.json();
      setPatients(data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }

  useEffect(() => {
    getPatients();
  }, []);

  async function deletePatient(id) {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    
    try {
      const response = await fetch("/api/addpatient", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        getPatients();
      }
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
      if (data.success) {
        getPatients();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" ? true : patient.priority === filter;
      return matchesSearch && matchesFilter;
    });
  }, [patients, search, filter]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return "badge-critical";
      case "High":
        return "badge-high";
      case "Medium":
        return "badge-medium";
      case "Low":
        return "badge-low";
      default:
        return "badge-low";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="label">Search Patients</label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Search by name or symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="label">Filter by Priority</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Patient Registry
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredPatients.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Symptoms</th>
                  <th>Assigned Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {patient.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          ID: {String(patient._id).substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {patient.age} yrs
                      </span>
                    </td>
                    <td>
                      <span
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {patient.gender}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadge(patient.priority)}`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {patient.department}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-sm max-w-xs truncate block"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {patient.symptoms}
                      </span>
                    </td>
                    <td>
                      {patient.doctor ? (
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {patient.doctor.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {patient.doctor.specialization}
                          </p>
                        </div>
                      ) : (
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--color-warning)" }}
                        >
                          ⊘ Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {!patient.doctor && (
                          <AssignDoctorModal
                            patientId={patient._id}
                            onAssigned={getPatients}
                          />
                        )}

                        {patient.doctor && (
                          <button
                            onClick={() => updateStatus(patient._id, "Completed")}
                            className="btn btn-secondary text-xs py-1.5"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          onClick={() => deletePatient(patient._id)}
                          className="btn btn-icon"
                          title="Delete patient"
                          aria-label="Delete patient"
                        >
                          <Trash2 size={16} style={{ color: "var(--color-danger)" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {search || filter !== "All"
                ? "No patients match your search filters"
                : "No patients registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}