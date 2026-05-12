"use client";

import { useEffect, useMemo, useState } from "react";
import AssignEquipmentModal from "@/components/equipment/AssignEquipmentModal";
export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // DELETE EQUIPMENT
  async function deleteEquipment(id) {
    try {
      const response = await fetch("/api/addequipment", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // refresh table
        getEquipment();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // FETCH EQUIPMENT
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
      console.log(error);

      setEquipment([]);
    }
  }

  useEffect(() => {
    getEquipment();
  }, []);

  // FILTER EQUIPMENT
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" ? true : item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [equipment, search, filter]);

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-2xl font-semibold">Equipment Management</h1>

            <p className="text-sm text-zinc-500 mt-1">
              Monitor and manage emergency room equipment
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-black text-white px-4 py-2 rounded-xl text-sm">
              Total: {equipment.length}
            </div>

            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm">
              Available:{" "}
              {equipment.filter((item) => item.status === "Available").length}
            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm">
              In Use:{" "}
              {equipment.filter((item) => item.status === "In Use").length}
            </div>

            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
              Maintenance:{" "}
              {equipment.filter((item) => item.status === "Maintenance").length}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              border border-zinc-300
              rounded-xl
              px-4 py-3
              w-full lg:w-80
              outline-none
            "
          />

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2">
            {["All", "Available", "In Use", "Maintenance"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 rounded-xl text-sm

                  ${
                    filter === status
                      ? "bg-black text-white"
                      : "bg-zinc-100 text-black"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT TABLE */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr
                className="
                  border-b border-zinc-200
                  text-left text-sm text-zinc-500
                "
              >
                <th className="pb-4">Equipment</th>

                <th className="pb-4">Category</th>

                <th className="pb-4">Room</th>

                <th className="pb-4">Status</th>

                <th className="pb-4">Assigned Patient</th>

                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredEquipment.map((item) => (
                <tr
                  key={item._id}
                  className="
                    border-b border-zinc-100
                  "
                >
                  {/* NAME */}
                  <td className="py-4 font-medium">{item.name}</td>

                  {/* CATEGORY */}
                  <td>{item.category}</td>

                  {/* ROOM */}
                  <td>{item.roomNumber}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs

                        ${
                          item.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : item.status === "In Use"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* ASSIGNED PATIENT */}
                  <td>
                    {item.assignedPatient
                      ? item.assignedPatient.name
                      : "Not Assigned"}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <AssignEquipmentModal equipmentId={item._id} />

                      <button
                        className="
                          bg-yellow-100 text-yellow-700
                          px-3 py-1 rounded-lg text-xs
                        "
                      >
                        Maintenance
                      </button>
                      <button
                        onClick={() => deleteEquipment(item._id)}
                        className="
    bg-red-100 text-red-700
    px-3 py-1 rounded-lg text-xs
  "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {filteredEquipment.length === 0 && (
            <div className="py-16 text-center text-zinc-400">
              No equipment found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
