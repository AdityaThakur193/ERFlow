"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Users, Stethoscope, Activity, Circle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activePatients: 8,
    availableDoctors: 12,
    equipment: 47,
    criticalCases: 2,
  });

  const [emergencyQueue, setEmergencyQueue] = useState([
    {
      id: 1,
      name: "John Adams",
      priority: "Critical",
      symptoms: "Chest pain, shortness of breath",
      assignedDoctor: "Dr. Sarah Lee",
      timeInQueue: "15 min",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      priority: "High",
      symptoms: "Head trauma, dizziness",
      assignedDoctor: "Dr. James Smith",
      timeInQueue: "32 min",
    },
    {
      id: 3,
      name: "Robert Chen",
      priority: "Medium",
      symptoms: "Fractured arm",
      assignedDoctor: "Unassigned",
      timeInQueue: "8 min",
    },
    {
      id: 4,
      name: "Emily Thompson",
      priority: "Low",
      symptoms: "Minor laceration",
      assignedDoctor: "Dr. Michael Brown",
      timeInQueue: "2 min",
    },
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return { badge: "badge-critical", tone: "var(--color-danger)" };
      case "High":
        return { badge: "badge-high", tone: "var(--color-warning)" };
      case "Medium":
        return { badge: "badge-medium", tone: "var(--color-info)" };
      case "Low":
        return { badge: "badge-low", tone: "var(--color-success)" };
      default:
        return { badge: "badge-low", tone: "var(--color-text-tertiary)" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Patients */}
        <div className="metric-card metric-card-1 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">
                Active Patients
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.activePatients}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "color-mix(in srgb, var(--metric-text) 18%, transparent)" }}
            >
              <Users size={24} style={{ color: "var(--metric-text)" }} />
            </div>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="metric-card metric-card-2 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">
                Available Doctors
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.availableDoctors}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "color-mix(in srgb, var(--metric-text) 18%, transparent)" }}
            >
              <Stethoscope
                size={24}
                style={{ color: "var(--metric-text)" }}
              />
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div className="metric-card metric-card-3 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">
                Equipment Available
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.equipment}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "color-mix(in srgb, var(--metric-text) 18%, transparent)" }}
            >
              <Activity size={24} style={{ color: "var(--metric-text)" }} />
            </div>
          </div>
        </div>

        {/* Critical Cases */}
        <div className="metric-card metric-card-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">
                Critical Cases
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.criticalCases}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "color-mix(in srgb, var(--metric-text) 18%, transparent)" }}
            >
              <AlertCircle
                size={24}
                style={{ color: "var(--metric-text)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Queue */}
      <div className="card p-6">
        <div className="mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Emergency Queue
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {emergencyQueue.length} patients awaiting treatment
          </p>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Priority</th>
                <th>Symptoms</th>
                <th>Assigned Doctor</th>
                <th>Time in Queue</th>
              </tr>
            </thead>
            <tbody>
              {emergencyQueue.map((patient) => {
                const { badge, tone } = getPriorityColor(patient.priority);
                return (
                  <tr key={patient.id}>
                    <td>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {patient.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          ID: {String(patient.id).padStart(5, "0")}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${badge}`}>
                        <Circle size={10} fill={tone} style={{ color: tone }} /> {patient.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {patient.symptoms}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {patient.assignedDoctor === "Unassigned" ? (
                          <span
                            className="font-semibold"
                            style={{ color: "var(--color-warning)" }}
                          >
                            {patient.assignedDoctor}
                          </span>
                        ) : (
                          patient.assignedDoctor
                        )}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {patient.timeInQueue}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bed Occupancy */}
        <div className="card p-6">
          <h3
            className="font-bold text-lg mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Bed Occupancy
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ICU Beds
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  8/10
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div
                  className="h-full"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    width: "80%",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  General Ward
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-success)" }}
                >
                  12/15
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div
                  className="h-full"
                  style={{
                    backgroundColor: "var(--color-success)",
                    width: "80%",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Emergency Beds
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-warning)" }}
                >
                  6/8
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <div
                  className="h-full"
                  style={{
                    backgroundColor: "var(--color-warning)",
                    width: "75%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Status */}
        <div className="card p-6">
          <h3
            className="font-bold text-lg mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Department Status
          </h3>
          <div className="space-y-2">
            {[
              { dept: "Cardiology", status: "active" },
              { dept: "Neurology", status: "active" },
              { dept: "Orthopedics", status: "busy" },
              { dept: "General Surgery", status: "active" },
            ].map((item) => (
              <div
                key={item.dept}
                className="flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.dept}
                </span>
                <span
                  className={`badge ${
                    item.status === "active"
                      ? "badge-active"
                      : "badge-busy"
                  }`}
                >
                  {item.status === "active" ? "✓ Active" : "⊘ Busy"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
