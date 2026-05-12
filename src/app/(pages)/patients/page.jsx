"use client";

import { useEffect, useMemo, useState } from "react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");

      const data = await response.json();

      setPatients(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPatients();
  }, []);

  // DELETE PATIENT
  async function deletePatient(id) {
    try {
      const response = await fetch("/api/addpatient", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        getPatients();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // UPDATE STATUS
  async function updateStatus(id, status) {
    try {
      const response = await fetch("/api/addpatient", {
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
        getPatients();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // FILTERED PATIENTS
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.symptoms.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" ? true : patient.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [patients, search, filter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <h1 className="text-2xl font-semibold">Patients Management</h1>

            <p className="text-sm text-zinc-500 mt-1">
              Monitor and manage emergency room patients
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-wrap gap-2">
            <button className="bg-black text-white px-4 py-2 rounded-xl text-sm">
              Total: {patients.length}
            </button>

            <button className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
              Critical:{" "}
              {patients.filter((p) => p.priority === "Critical").length}
            </button>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Search patients..."
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

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "Waiting", "In treatment", "Completed"].map((status) => (
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

      {/* Patients Table */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr
                className="
                  border-b border-zinc-200
                  text-left text-sm text-zinc-500
                "
              >
                <th className="pb-4">Patient</th>
                <th className="pb-4">Age</th>
                <th className="pb-4">Gender</th>
                <th className="pb-4">Symptoms</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Department</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="border-b border-zinc-100">
                  {/* Name */}
                  <td className="py-4 font-medium">{patient.name}</td>

                  {/* Age */}
                  <td>{patient.age}</td>

                  {/* Gender */}
                  <td>{patient.gender}</td>

                  {/* Symptoms */}
                  <td>{patient.symptoms}</td>

                  {/* Priority */}
                  <td>
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs

                        ${
                          patient.priority === "Critical"
                            ? "bg-red-100 text-red-700"
                            : patient.priority === "High"
                              ? "bg-orange-100 text-orange-700"
                              : patient.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {patient.priority}
                    </span>
                  </td>

                  {/* Department */}
                  <td>{patient.department}</td>

                  {/* Status */}
                  <td>
                    <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs">
                      {patient.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          updateStatus(patient._id, "In treatment")
                        }
                        className="
                          bg-blue-100 text-blue-700
                          px-3 py-1 rounded-lg text-xs
                        "
                      >
                        Treat
                      </button>

                      <button
                        onClick={() => updateStatus(patient._id, "Completed")}
                        className="
                          bg-green-100 text-green-700
                          px-3 py-1 rounded-lg text-xs
                        "
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => deletePatient(patient._id)}
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

          {/* Empty State */}
          {filteredPatients.length === 0 && (
            <div className="py-16 text-center text-zinc-400">
              No patients found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
