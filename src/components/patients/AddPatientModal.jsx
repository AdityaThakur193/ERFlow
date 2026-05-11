"use client";

import { useState } from "react";

export default function AddPatientModal() {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
    priority: "Low",
    department: "Emergency",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/addpatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Patient Added Successfully");

        setIsOpen(false);

        setFormData({
          name: "",
          age: "",
          gender: "Male",
          symptoms: "",
          priority: "Low",
          department: "Emergency",
        });
      }
    } catch (error) {
      console.log("ADD PATIENT ERROR:", error);
    }
  }

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          bg-black text-white
          px-4 py-2
          rounded-xl
          text-sm font-medium
        "
      >
        + Patient
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/40
            p-4
          "
        >
          <div
            className="
              w-full max-w-2xl
              bg-white
              rounded-2xl
              border border-zinc-200
              p-6
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-black">
                  Add Emergency Patient
                </h1>

                <p className="text-sm text-zinc-500 mt-1">
                  Create a new patient entry for the emergency room
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-zinc-500"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="
                grid grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {/* Patient Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Patient Name</label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Age</label>

                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Gender</label>

                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Priority</label>

                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                >
                  <option value="Critical">Critical</option>

                  <option value="High">High</option>

                  <option value="Medium">Medium</option>

                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Department</label>

                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                >
                  <option value="Emergency">Emergency</option>

                  <option value="ICU">ICU</option>

                  <option value="Cardiology">Cardiology</option>

                  <option value="Neurology">Neurology</option>

                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              {/* Symptoms */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm text-zinc-600">Symptoms</label>

                <textarea
                  rows={4}
                  required
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symptoms: e.target.value,
                    })
                  }
                  className="
                    border border-zinc-300
                    rounded-xl
                    px-4 py-3
                    outline-none
                    resize-none
                  "
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    border border-zinc-300
                    px-4 py-2
                    rounded-xl
                    text-black
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    bg-black text-white
                    px-5 py-2
                    rounded-xl
                  "
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
