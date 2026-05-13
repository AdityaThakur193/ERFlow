"use client";

import { useEffect, useMemo, useState } from "react";
import AddDoctorModal from "@/components/doctors/AddDoctorModal";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // FETCH DOCTORS
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
      console.log("FETCH DOCTORS ERROR:", error);
      setDoctors([]);
    }
  }

  useEffect(() => {
    getDoctors();
  }, []);

  // DELETE DOCTOR
  async function deleteDoctor(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch("/api/adddoctor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        getDoctors();
      }
    } catch (error) {
      console.log("DELETE DOCTOR ERROR:", error);
    }
  }

  // UPDATE STATUS
  async function updateStatus(id, status) {
    try {
      const response = await fetch("/api/adddoctor", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        getDoctors();
      }
    } catch (error) {
      console.log("UPDATE DOCTOR STATUS ERROR:", error);
    }
  }

  // FILTERED DOCTORS
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
        doctor.roomNumber.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" ? true : doctor.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [doctors, search, filter]);

  // STATS
  const availableCount = doctors.filter((d) => d.status === "Available").length;
  const busyCount = doctors.filter((d) => d.status === "busy").length;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-2xl font-semibold">Doctor Management</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage emergency room doctors and their availability
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-black text-white px-4 py-2 rounded-xl text-sm">
              Total: {doctors.length}
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm">
              Available: {availableCount}
            </div>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
              Busy: {busyCount}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-zinc-300 rounded-xl px-4 py-3 w-full lg:w-80 outline-none"
          />

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2">
            {["All", "Available", "busy"].map((status) => (
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
                {status === "busy" ? "Busy" : status}
              </button>
            ))}
            {/* Add Doctor Button */}
            <AddDoctorModal />
          </div>
        </div>
      </section>

      {/* DOCTORS TABLE */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-sm text-zinc-500">
                <th className="pb-4">Doctor</th>
                <th className="pb-4">Specialization</th>
                <th className="pb-4">Room</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Joined</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor._id} className="border-b border-zinc-100">
                  {/* NAME */}
                  <td className="py-4 font-medium">{doctor.name}</td>

                  {/* SPECIALIZATION */}
                  <td>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                      {doctor.specialization}
                    </span>
                  </td>

                  {/* ROOM */}
                  <td>{doctor.roomNumber}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs
                        ${
                          doctor.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {doctor.status === "busy" ? "Busy" : "Available"}
                    </span>
                  </td>

                  {/* JOINED DATE */}
                  <td>
                    {new Date(doctor.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          updateStatus(
                            doctor._id,
                            doctor.status === "Available" ? "busy" : "Available"
                          )
                        }
                        className={`
                          px-3 py-1 rounded-lg text-xs
                          ${
                            doctor.status === "Available"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {doctor.status === "Available"
                          ? "Mark Busy"
                          : "Mark Available"}
                      </button>

                      <button
                        onClick={() => deleteDoctor(doctor._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs"
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
          {filteredDoctors.length === 0 && (
            <div className="py-16 text-center text-zinc-400">
              {doctors.length === 0
                ? "No doctors registered yet. Click 'Add Doctor' to get started."
                : "No doctors found matching your search or filters."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}