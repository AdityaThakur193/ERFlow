"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import AssignEquipmentModal from "@/components/equipment/AssignEquipmentModal";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function deleteEquipment(id) {
    if (!confirm("Are you sure you want to remove this equipment?")) return;

    try {
      const response = await fetch("/api/addequipment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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

  useEffect(() => {
    getEquipment();
  }, []);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" ? true : item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [equipment, search, filter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return "badge-available";
      case "In Use":
        return "badge-busy";
      case "Maintenance":
        return "badge-high";
      default:
        return "badge-low";
    }
  };

  const availableCount = equipment.filter((item) => item.status === "Available").length;
  const inUseCount = equipment.filter((item) => item.status === "In Use").length;
  const maintenanceCount = equipment.filter((item) => item.status === "Maintenance").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Total Equipment
          </p>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: "var(--color-primary)" }}
          >
            {equipment.length}
          </p>
        </div>

        <div className="card p-6">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Available
          </p>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: "var(--color-success)" }}
          >
            {availableCount}
          </p>
        </div>

        <div className="card p-6">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            In Use
          </p>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: "var(--color-info)" }}
          >
            {inUseCount}
          </p>
        </div>

        <div className="card p-6">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Maintenance
          </p>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: "var(--color-warning)" }}
          >
            {maintenanceCount}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="label">Search Equipment</label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Table Card */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Equipment Inventory
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {filteredEquipment.length} item{filteredEquipment.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredEquipment.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Assigned Patient</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEquipment.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          ID: {String(item._id).substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </td>

                    <td>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {item.roomNumber}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {item.assignedPatient ? (
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {item.assignedPatient.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-tertiary)" }}
                          >
                            {item.assignedPatient.department}
                          </p>
                        </div>
                      ) : (
                        <span
                          className="text-sm"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          Not Assigned
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        {item.status === "Available" && (
                          <AssignEquipmentModal equipmentId={item._id} />
                        )}

                        <button
                          onClick={() => deleteEquipment(item._id)}
                          className="btn btn-icon"
                          title="Remove equipment"
                          aria-label="Remove equipment"
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
                ? "No equipment matches your search filters"
                : "No equipment registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
