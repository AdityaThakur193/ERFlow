"use client";

import { useEffect, useMemo, useState } from "react";
import AssignDoctorModal from "@/components/patients/AssignDoctorModal";

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
        headers: { "Content-Type": "application/json" },
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

  // UPDATE STATUS (legacy – keep for "Complete" button)
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
      {/* ... (header and search/filter sections unchanged) ... */}

      {/* Patients Table */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-sm text-zinc-500">
                <th className="pb-4">Patient</th>
                <th className="pb-4">Age</th>
                <th className="pb-4">Gender</th>
                <th className="pb-4">Symptoms</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Department</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Assigned Doctor</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="border-b border-zinc-100">
                  <td className="py-4 font-medium">{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.symptoms}</td>
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
                  <td>{patient.department}</td>
                  <td>
                    <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs">
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    {patient.doctor ? (
                      <span className="text-blue-600 font-medium">
                        {patient.doctor.name}
                      </span>
                    ) : (
                      <span className="text-zinc-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {/* Treat button – only show for Waiting patients */}
                      {patient.status === "Waiting" && (
                        <AssignDoctorModal
                          patientId={patient._id}
                          onAssigned={getPatients}
                        />
                      )}

                      {/* Complete button – only for In treatment patients */}
                      {patient.status === "In treatment" && (
                        <button
                          onClick={() => updateStatus(patient._id, "Completed")}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs"
                        >
                          Complete
                        </button>
                      )}

                      {/* Delete button */}
                      <button
                        onClick={() => deletePatient(patient._id)}
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