"use client";

import { useEffect, useState } from "react";
import { Users, AlertTriangle, Clock3, Building2 } from "lucide-react";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);

  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");

      const data = await response.json();

      if (data.success) {
        setPatients(data.data || []);
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

  const totalPatients = patients.length;
  const criticalPatients = patients.filter(
    (patient) => patient.priority === "Critical",
  ).length;
  const waitingPatients = patients.filter(
    (patient) => patient.status === "Waiting",
  ).length;
  const departmentsActive = new Set(
    patients.map((patient) => patient.department).filter(Boolean),
  ).size;

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
        <div className="metric-card metric-card-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">
                Total Active Patients
              </p>
              <h1 className="text-4xl font-bold mt-3">{totalPatients}</h1>
            </div>
            <Users size={22} />
          </div>

          <p className="text-sm mt-2 opacity-85">
            Patients currently inside the emergency room
          </p>
        </div>

        {/* Card 2 */}
        <div className="metric-card metric-card-2 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">
                Critical Patients
              </p>
              <h1 className="text-4xl font-bold mt-3">{criticalPatients}</h1>
            </div>
            <AlertTriangle size={22} />
          </div>

          <p className="text-sm mt-2 opacity-85">
            High priority emergency cases requiring immediate attention
          </p>
        </div>

        {/* Card 3 */}
        <div className="metric-card metric-card-3 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Waiting Patients</p>
              <h1 className="text-4xl font-bold mt-3">{waitingPatients}</h1>
            </div>
            <Clock3 size={22} />
          </div>

          <p className="text-sm mt-2 opacity-85">
            Patients currently waiting for treatment
          </p>
        </div>

        {/* Card 4 */}
        <div className="metric-card metric-card-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">
                Departments Active
              </p>
              <h1 className="text-4xl font-bold mt-3">{departmentsActive}</h1>
            </div>
            <Building2 size={22} />
          </div>

          <p className="text-sm mt-2 opacity-85">
            Emergency departments currently operating
          </p>
        </div>
      </section>

      {/* Queue Section */}
      <section className="card rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Emergency Queue
            </h2>

            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Patients in Queue
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="table-container w-full overflow-x-auto">
          <table className="table w-full min-w-[700px]">
            <thead>
              <tr>
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
                <tr key={patient._id}>
                  {/* Name */}
                  <td className="py-4 font-medium">{patient.name}</td>

                  {/* Age */}
                  <td>{patient.age}</td>

                  {/* Symptoms */}
                  <td>{patient.symptoms}</td>

                  {/* Priority */}
                  <td>
                    <span
                      className={`badge ${
                        patient.priority === "Critical"
                          ? "badge-critical"
                          : patient.priority === "High"
                            ? "badge-high"
                            : patient.priority === "Medium"
                              ? "badge-medium"
                              : "badge-low"
                      }`}
                    >
                      {patient.priority}
                    </span>
                  </td>

                  {/* Department */}
                  <td>{patient.department}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge ${
                        patient.status === "Waiting"
                          ? "badge-busy"
                          : "badge-active"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {patients.length === 0 && (
            <div
              className="py-16 text-center"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No patients found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
