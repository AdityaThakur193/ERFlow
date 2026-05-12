"use client";

import { useEffect, useState } from "react";

export default function AssignDoctorModal({ patientId, onAssigned }) {
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchAvailableDoctors() {
    try {
      const res = await fetch("/api/adddoctor");
      const data = await res.json();
      if (data.success) {
        // Only show available doctors
        const available = data.data.filter(d => d.status === "Available");
        setDoctors(available);
      }
    } catch (error) {
      console.log("FETCH DOCTORS ERROR:", error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDoctors();
    }
  }, [isOpen]);

  async function handleAssign() {
    if (!selectedDoctor) {
      alert("Please select a doctor");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/assign-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctor,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Doctor assigned successfully! Patient is now in treatment.");
        setIsOpen(false);
        setSelectedDoctor("");
        if (onAssigned) onAssigned();
      } else {
        alert(data.message || "Failed to assign doctor");
      }
    } catch (error) {
      console.log("ASSIGN DOCTOR ERROR:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition-colors"
      >
        Treat
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-black">Assign Doctor</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Select an available doctor to treat this patient
              </p>
            </div>

            {/* Doctor Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-600 mb-2">
                Available Doctors
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full border border-zinc-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} — {doc.specialization} (Room {doc.roomNumber})
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (
                <p className="text-sm text-zinc-400 mt-2">
                  No doctors available at this time.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="border border-zinc-300 px-4 py-2 rounded-xl text-black hover:bg-zinc-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={loading || !selectedDoctor || doctors.length === 0}
                className={`
                  px-5 py-2 rounded-xl text-white font-medium
                  ${loading || !selectedDoctor || doctors.length === 0
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-black hover:bg-zinc-800"
                  }
                `}
              >
                {loading ? "Assigning..." : "Assign Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}