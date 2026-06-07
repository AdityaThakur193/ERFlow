"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import AssignEquipmentModal from "@/components/equipment/AssignEquipmentModal";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import { toast } from "@/components/providors/CustomToast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [confirm, setConfirm] = useState(null);

  async function getEquipment() {
    try {
      const response = await fetch("/api/addequipment");
      const data = await response.json();
      if (data.success) {
        setEquipment(data.data || []);
      } else {
        setEquipment([]);
      }
    } catch (error) {
      console.error("FETCH EQUIPMENT ERROR:", error);
      setEquipment([]);
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
    getEquipment();
    getUser();
  }, []);

  async function deleteEquipment(id) {
    try {
      const response = await fetch("/api/addequipment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        getEquipment();
      }
    } catch (error) {
      console.error("DELETE EQUIPMENT ERROR:", error);
    }
  }

  async function unassignEquipment(id) {
    try {
      const response = await fetch("/api/addequipment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "unassign" }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Equipment unassigned");
        getEquipment();
      } else {
        toast.error(data.message || "Failed to unassign");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" ? true : item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [equipment, search, filter]);

  const availableCount = equipment.filter((item) => item.status === "Available").length;
  const inUseCount = equipment.filter((item) => item.status === "In Use").length;
  const maintenanceCount = equipment.filter((item) => item.status === "Maintenance").length;
  // ⭐ Total inventory units across all equipment
  const totalInventory = equipment.reduce((sum, item) => sum + (item.inventory || 0), 0);

  return (
    <div className="space-y-6">
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Equipment Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Track and manage hospital equipment inventory
          </p>
        </div>
        {user?.position === "Admin" && (
          <AddEquipmentModal onAdded={getEquipment} />
        )}
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Total Equipment Types</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-primary)" }}>{equipment.length}</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>{totalInventory} total units</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Available</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-success)" }}>{availableCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>In Use</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-info)" }}>{inUseCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Maintenance</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-warning)" }}>{maintenanceCount}</p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-tertiary)" }} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Available", "In Use", "Maintenance"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={filter === status ? "btn btn-primary" : "btn btn-secondary"}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT TABLE */}
      <section className="card overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                {["Equipment", "Category", "Room", "Inventory", "Status", "Assigned Patient", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((item) => (
                <tr key={item._id}>
                  {/* NAME */}
                  <td>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{item.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                        ID: {String(item._id).substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td>{item.category}</td>

                  {/* ROOM */}
                  <td className="font-medium" style={{ color: "var(--color-text-primary)" }}>{item.roomNumber}</td>

                  {/* INVENTORY */}
                  <td>
                    <span className="font-bold" style={{ color: item.inventory > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                      {item.inventory} units
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`badge ${
                      item.status === "Available" ? "badge-available" :
                      item.status === "In Use" ? "badge-active" :
                      "badge-warning"
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  {/* ASSIGNED PATIENT */}
                  <td>
                    {item.assignedPatient ? (
                      <div>
                        <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>{item.assignedPatient.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>{item.assignedPatient.department} · {item.assignedPatient.priority}</p>
                        {(user?.position === "Admin" || user?.position === "Receptionist") && (
                          <button
                            onClick={() => setConfirm({
                              title: "Unassign Equipment",
                              message: `Unassign this equipment from ${item.assignedPatient?.name}?`,
                              confirmLabel: "Unassign",
                              isDanger: false,
                              onConfirm: () => unassignEquipment(item._id),
                            })}
                            className="btn btn-secondary text-xs py-1 px-2 mt-1"
                          >
                            Unassign
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "var(--color-text-tertiary)" }}>Not assigned</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {(user?.position === "Admin" || user?.position === "Receptionist") && (
                        <AssignEquipmentModal
                          equipmentId={item._id}
                          equipmentName={item.name}
                          inventory={item.inventory}
                          onAssigned={getEquipment}
                        />
                      )}
                      {user?.position === "Admin" && (
                        <button
                          onClick={() => setConfirm({
                            title: "Delete Equipment",
                            message: `Remove this equipment from the system? This cannot be undone.`,
                            confirmLabel: "Delete",
                            isDanger: true,
                            onConfirm: () => deleteEquipment(item._id),
                          })}
                          className="btn-icon"
                          title="Delete equipment"
                          aria-label="Delete equipment"
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
          {filteredEquipment.map((item) => (
            <div key={item._id} className="p-4 space-y-3 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base" style={{ color: "var(--color-text-primary)" }}>{item.name}</h3>
                  <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                    ID: {String(item._id).substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <span className={`badge ${
                  item.status === "Available" ? "badge-available" :
                  item.status === "In Use" ? "badge-active" :
                  "badge-warning"
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Category:</span>
                  <p className="mt-0.5">{item.category}</p>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Room:</span>
                  <p className="mt-0.5">{item.roomNumber}</p>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Inventory:</span>
                  <p className="mt-0.5 font-bold" style={{ color: item.inventory > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                    {item.inventory} units
                  </p>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "var(--color-text-tertiary)" }}>Assigned Patient:</span>
                  {item.assignedPatient ? (
                    <div className="mt-0.5 font-medium" style={{ color: "var(--color-text-primary)" }}>
                      <p>{item.assignedPatient.name}</p>
                      <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                        {item.assignedPatient.department} · {item.assignedPatient.priority}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>Not assigned</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--color-border-light)] text-xs">
                <div>
                  {item.assignedPatient && (user?.position === "Admin" || user?.position === "Receptionist") && (
                    <button
                      onClick={() => setConfirm({
                        title: "Unassign Equipment",
                        message: `Unassign this equipment from ${item.assignedPatient?.name}?`,
                        confirmLabel: "Unassign",
                        isDanger: false,
                        onConfirm: () => unassignEquipment(item._id),
                      })}
                      className="btn btn-secondary text-xs py-1.5 px-2.5"
                    >
                      Unassign
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(user?.position === "Admin" || user?.position === "Receptionist") && (
                    <AssignEquipmentModal
                      equipmentId={item._id}
                      equipmentName={item.name}
                      inventory={item.inventory}
                      onAssigned={getEquipment}
                    />
                  )}
                  {user?.position === "Admin" && (
                    <button
                      onClick={() => setConfirm({
                        title: "Delete Equipment",
                        message: `Remove this equipment from the system? This cannot be undone.`,
                        confirmLabel: "Delete",
                        isDanger: true,
                        onConfirm: () => deleteEquipment(item._id),
                      })}
                      className="btn-icon"
                      title="Delete equipment"
                      aria-label="Delete equipment"
                    >
                      <Trash2 size={15} color="var(--color-danger)" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: "var(--color-text-tertiary)" }}>
            No equipment found
          </div>
        )}
      </section>
    </div>
  );
}
