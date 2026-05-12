"use client";

import { useState } from "react";

export default function AddDoctorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "Emergency Medicine",
    roomNumber: "",
    status: "Available",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/adddoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Doctor Added Successfully");
        setIsOpen(false);
        setFormData({
          name: "",
          specialization: "Emergency Medicine",
          roomNumber: "",
          status: "Available",
        });
        window.location.reload();
      }
    } catch (error) {
      console.log("ADD DOCTOR ERROR:", error);
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium"
      >
        + Doctor
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-black">
                  Add Doctor
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Register a new doctor to the emergency department
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-zinc-500"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DOCTOR NAME */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border border-zinc-300 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              {/* SPECIALIZATION */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="border border-zinc-300 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Anesthesiology">Anesthesiology</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>

              {/* ROOM NUMBER */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Room Number</label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  className="border border-zinc-300 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              {/* STATUS */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="border border-zinc-300 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="busy">Busy</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-zinc-300 px-4 py-2 rounded-xl text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-5 py-2 rounded-xl"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}