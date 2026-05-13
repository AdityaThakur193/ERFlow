"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [noPatients, setNoPatients] = useState(0);
  
  const limit = 10
  
  

  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");

      const data = await response.json();

      if (data.success) {
        setPatients(data.data || []);
        setNoPatients(data.data.length);
        console.log(data.data.length);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.log("FETCH PATIENT ERROR:", error);
    }
  }

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <section
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <p className="text-sm text-zinc-500">Total Active Patients</p>

          <h1 className="text-4xl font-bold mt-3">{patients.length}</h1>

          <p className="text-sm text-zinc-400 mt-2">
            Patients currently inside the emergency room
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <p className="text-sm text-zinc-500">Critical Patients</p>

          <h1 className="text-4xl font-bold text-red-500 mt-3">
            {
              patients.filter((patient) => patient.priority === "Critical")
                .length
            }
          </h1>

          <p className="text-sm text-zinc-400 mt-2">
            High priority emergency cases requiring immediate attention
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <p className="text-sm text-zinc-500">Waiting Patients</p>

          <h1 className="text-4xl font-bold mt-3">
            {patients.filter((patient) => patient.status === "Waiting").length}
          </h1>

          <p className="text-sm text-zinc-400 mt-2">
            Patients currently waiting for treatment
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <p className="text-sm text-zinc-500">Departments Active</p>

          <h1 className="text-4xl font-bold mt-3">6</h1>

          <p className="text-sm text-zinc-400 mt-2">
            Emergency departments currently operating
          </p>
        </div>
      </section>

      {/* Queue Section */}
      <section
        className="
          bg-white
          rounded-2xl
          border border-zinc-200
          p-5
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Emergency Queue</h2>

            <p className="text-sm text-zinc-500 mt-1">Patients in Queue</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr
                className="
                  border-b border-zinc-200
                  text-left text-sm text-zinc-500
                "
              >
                <th className="pb-4">Patient</th>
                <th className="pb-4">Age</th>
                <th className="pb-4">Symptoms</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Department</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {patients.map((patient) => (
                <tr key={patient._id} className="border-b border-zinc-100">
                  {/* Name */}
                  <td className="py-4 font-medium">{patient.name}</td>

                  {/* Age */}
                  <td>{patient.age}</td>

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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {patients.length === 0 && (
            <div className="py-16 text-center text-zinc-400">
              No patients found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
