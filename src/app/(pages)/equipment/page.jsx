"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import AssignEquipmentModal from "@/components/equipment/AssignEquipmentModal";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import toast from "react-hot-toast";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState(null);

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
    if (!confirm("Are you sure you want to remove this equipment?")) return;
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
    if (!confirm("Unassign this equipment from its current patient?")) return;
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
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-tertiary)" }} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11 h-12"
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
      <section className="card w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--color-border-light)" }}>
                {["Equipment", "Category", "Room", "Inventory", "Status", "Assigned Patient", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((item) => (
                <tr
                  key={item._id}
                  className="border-b transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  {/* NAME */}
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{item.name}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                        ID: {String(item._id).substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5 text-sm" style={{ color: "var(--color-text-primary)" }}>{item.category}</td>

                  {/* ROOM */}
                  <td className="px-6 py-5 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{item.roomNumber}</td>

                  {/* ⭐ INVENTORY */}
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-bold" style={{ color: item.inventory > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                        {item.inventory} available
                      </p>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Available" ? "bg-green-100 text-green-700" :
                      item.status === "In Use" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  {/* ASSIGNED PATIENT */}
                  <td className="px-6 py-5">
                    {item.assignedPatient ? (
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{item.assignedPatient.name}</p>
                        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{item.assignedPatient.department} · {item.assignedPatient.priority}</p>
                        {(user?.position === "Admin" || user?.position === "Receptionist") && (
                          <button
                            onClick={() => unassignEquipment(item._id)}
                            className="text-xs mt-1 underline"
                            style={{ color: "var(--color-warning)" }}
                          >
                            Unassign
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>Not Assigned</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
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
                          onClick={() => deleteEquipment(item._id)}
                          className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--color-danger) 15%, transparent)",
                            color: "var(--color-danger)",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEquipment.length === 0 && (
            <div className="py-20 text-center text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No equipment found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
