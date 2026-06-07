"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import AddStaffModal from "@/components/staff/AddStaffModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [confirm, setConfirm] = useState(null);

  async function getDoctors() {
    try {
      const response = await fetch("/api/adddoctor");
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("FETCH DOCTORS ERROR:", error);
      setDoctors([]);
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
    getDoctors();
    getUser();
  }, []);

  async function deleteDoctor(id) {
    try {
      const response = await fetch("/api/adddoctor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) getDoctors();
    } catch (error) {
      console.error("DELETE DOCTOR ERROR:", error);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const response = await fetch("/api/adddoctor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) getDoctors();
    } catch (error) {
      console.error("UPDATE DOCTOR STATUS ERROR:", error);
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
        (doctor.department || "").toLowerCase().includes(search.toLowerCase()) ||
        doctor.roomNumber.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" ? true : doctor.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [doctors, search, filter]);

  const availableCount = doctors.filter((d) => d.status === "Available").length;
  const busyCount = doctors.filter((d) => d.status === "busy").length;
  const onBreakCount = doctors.filter((d) => d.status === "On Break").length;

  const getStatusBadge = (status) => {
    if (status === "Available") return "badge-available";
    if (status === "busy") return "badge-busy";
    return "badge-medium"; // On Break
  };

  // Cycle status: Available → On Break → busy (manual override)
  function getNextStatus(current) {
    if (current === "Available") return "On Break";
    if (current === "On Break") return "Available";
    // If busy (auto-managed), let them toggle to On Break
    return "On Break";
  }

  function getStatusToggleLabel(current) {
    if (current === "Available") return "Go On Break";
    if (current === "On Break") return "Mark Available";
    return "Go On Break"; // busy
  }

  return (
    <div className="space-y-6">
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: "var(--color-text-primary)" }}>
            Doctor Registry
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Manage physician duty status, room/station assignments, and active patient treatments
          </p>
        </div>
        {user?.position === "Admin" && (
          <AddStaffModal forcePosition="Doctor" onAdded={getDoctors} />
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Total Doctors</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-primary)" }}>{doctors.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Available</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-success)" }}>{availableCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Currently Busy</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-warning)" }}>{busyCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>On Break</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-text-tertiary)" }}>{onBreakCount}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Search Doctors</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-tertiary)" }} />
              <input
                type="text"
                placeholder="Search by name, specialization, department, or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label">Filter by Status</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select">
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="busy">Busy</option>
              <option value="On Break">On Break</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Doctor Registry</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredDoctors.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block table-container" style={{ border: "none", borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Department</th>
                    <th>Room/Station</th>
                    <th>Status</th>
                    <th>Patients</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>
                        <div>
                          <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Dr. {doctor.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                            ID: {String(doctor._id).substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-medium">{doctor.specialization}</span>
                      </td>
                      {/* ⭐ Department column */}
                      <td>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {doctor.department || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {doctor.roomNumber}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(doctor.status)}`}>
                          {doctor.status === "busy" ? "Busy" : doctor.status}
                        </span>
                      </td>
                      {/* ⭐ Patient count */}
                      <td>
                        <span className="text-sm font-medium" style={{
                          color: doctor.patients?.length > 0 ? "var(--color-warning)" : "var(--color-text-tertiary)"
                        }}>
                          {doctor.patients?.length || 0} patient{doctor.patients?.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {/* Manual status override - Only Admin or the Doctor themselves */}
                          {(user?.position === "Admin" || (user?.position === "Doctor" && user?.username?.toLowerCase().includes(doctor.name.toLowerCase()))) && (
                            <button
                              onClick={() => updateStatus(doctor._id, getNextStatus(doctor.status))}
                              className="btn btn-secondary text-xs py-1.5"
                            >
                              {getStatusToggleLabel(doctor.status)}
                            </button>
                          )}
                          {/* Delete - Admin only */}
                          {user?.position === "Admin" && (
                            <button
                              onClick={() => setConfirm({
                                title: "Remove Doctor",
                                message: `Remove Dr. ${doctor.name} from the registry? This cannot be undone.`,
                                confirmLabel: "Remove",
                                isDanger: true,
                                onConfirm: () => deleteDoctor(doctor._id),
                              })}
                              className="btn-icon"
                              title="Remove doctor"
                              aria-label="Remove doctor"
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
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="p-4 space-y-3 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "var(--color-text-primary)" }}>
                        Dr. {doctor.name}
                      </h3>
                      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                        ID: {String(doctor._id).substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`badge ${getStatusBadge(doctor.status)}`}>
                      {doctor.status === "busy" ? "Busy" : doctor.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Specialization:</span>
                      <p className="mt-0.5">{doctor.specialization}</p>
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Department:</span>
                      <p className="mt-0.5">{doctor.department || "—"}</p>
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Room / Station:</span>
                      <p className="mt-0.5">{doctor.roomNumber}</p>
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Active Patients:</span>
                      <p className="mt-0.5 font-medium" style={{
                        color: doctor.patients?.length > 0 ? "var(--color-warning)" : "var(--color-text-tertiary)"
                      }}>
                        {doctor.patients?.length || 0} patient{doctor.patients?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border-light)]">
                    {/* Manual status override - Only Admin or the Doctor themselves */}
                    {(user?.position === "Admin" || (user?.position === "Doctor" && user?.username?.toLowerCase().includes(doctor.name.toLowerCase()))) && (
                      <button
                        onClick={() => updateStatus(doctor._id, getNextStatus(doctor.status))}
                        className="btn btn-secondary text-xs py-1.5 px-3"
                      >
                        {getStatusToggleLabel(doctor.status)}
                      </button>
                    )}
                    {/* Delete - Admin only */}
                    {user?.position === "Admin" && (
                      <button
                        onClick={() => setConfirm({
                          title: "Remove Doctor",
                          message: `Remove Dr. ${doctor.name} from the registry? This cannot be undone.`,
                          confirmLabel: "Remove",
                          isDanger: true,
                          onConfirm: () => deleteDoctor(doctor._id),
                        })}
                        className="btn-icon"
                        title="Remove doctor"
                        aria-label="Remove doctor"
                      >
                        <Trash2 size={15} color="var(--color-danger)" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              {search || filter !== "All" ? "No doctors match your search filters" : "No doctors registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}