"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, AlertTriangle, Clock3, Building2 } from "lucide-react";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  const getPatients = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    getPatients();
    // ⭐ Auto-refresh every 10 seconds
    const interval = setInterval(getPatients, 10000);
    return () => clearInterval(interval);
  }, [getPatients]);

  // ⭐ Only count ACTIVE patients (exclude Completed)
  const activePatients = patients.filter(
    (p) => p.status === "Waiting" || p.status === "In treatment"
  );

  const totalPatients = activePatients.length;
  const criticalPatients = activePatients.filter(
    (p) => p.priority === "Critical"
  ).length;
  const waitingPatients = activePatients.filter(
    (p) => p.status === "Waiting"
  ).length;
  const departmentsActive = new Set(
    activePatients.map((p) => p.department).filter(Boolean)
  ).size;

  // Navigate to patients page with a pre-applied filter via URL params
  function navigateFiltered(filter) {
    router.push(`/patients?filter=${filter}`);
  }

  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 - Total Active */}
        <div
          className="metric-card metric-card-1 p-5 cursor-pointer"
          onClick={() => navigateFiltered("active")}
          title="Click to view all active patients"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Total Active Patients</p>
              <h2 className="text-4xl font-bold mt-3">{totalPatients}</h2>
            </div>
            <Users size={22} />
          </div>
          <p className="text-sm mt-2 opacity-85">
            Waiting + In treatment (excludes completed)
          </p>
        </div>

        {/* Card 2 - Critical */}
        <div
          className="metric-card metric-card-2 p-5 cursor-pointer"
          onClick={() => navigateFiltered("Critical")}
          title="Click to view critical patients"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Critical Patients</p>
              <h2 className="text-4xl font-bold mt-3">{criticalPatients}</h2>
            </div>
            <AlertTriangle size={22} />
          </div>
          <p className="text-sm mt-2 opacity-85">
            High priority emergency cases requiring immediate attention
          </p>
        </div>

        {/* Card 3 - Waiting */}
        <div
          className="metric-card metric-card-3 p-5 cursor-pointer"
          onClick={() => navigateFiltered("Waiting")}
          title="Click to view waiting patients"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Waiting Patients</p>
              <h2 className="text-4xl font-bold mt-3">{waitingPatients}</h2>
            </div>
            <Clock3 size={22} />
          </div>
          <p className="text-sm mt-2 opacity-85">
            Patients currently waiting for treatment
          </p>
        </div>

        {/* Card 4 - Departments */}
        <div className="metric-card metric-card-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Departments Active</p>
              <h2 className="text-4xl font-bold mt-3">{departmentsActive}</h2>
            </div>
            <Building2 size={22} />
          </div>
          <p className="text-sm mt-2 opacity-85">
            Emergency departments currently treating patients
          </p>
        </div>
      </section>

      {/* Emergency Queue */}
      <section className="card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Emergency Queue
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Active patients sorted by priority · Auto-refreshes every 10s
            </p>
          </div>
        </div>

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
              {activePatients.map((patient) => (
                <tr key={patient._id}>
                  <td className="py-4 font-medium">{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>
                    <span className="block max-w-xs truncate">{patient.symptoms}</span>
                  </td>
                  <td>
                    <span className={`badge ${
                      patient.priority === "Critical" ? "badge-critical" :
                      patient.priority === "High" ? "badge-high" :
                      patient.priority === "Medium" ? "badge-medium" : "badge-low"
                    }`}>
                      {patient.priority}
                    </span>
                  </td>
                  <td>{patient.department}</td>
                  <td>
                    <span className={`badge ${patient.status === "Waiting" ? "badge-busy" : "badge-active"}`}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activePatients.length === 0 && (
            <div className="py-16 text-center" style={{ color: "var(--color-text-tertiary)" }}>
              No active patients in the queue
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
