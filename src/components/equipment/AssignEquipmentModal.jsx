"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AssignEquipmentModal({ equipmentId }) {
  const [isOpen, setIsOpen] = useState(false);

  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");

  // FETCH PATIENTS
  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");

      const data = await response.json();
      console.log(data);
      

      if (data.success) {
        setPatients(data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      getPatients();
    }
  }, [isOpen]);

  // ASSIGN EQUIPMENT
  async function assignEquipment() {
    try {
      const response = await fetch("/api/addequipment", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: equipmentId,

          status: "In Use",

          assignedPatient: selectedPatient,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast("Equipment Assigned Successfully");

        setIsOpen(false);

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          bg-blue-100 text-blue-700
          px-3 py-1 rounded-lg text-xs
        "
      >
        Assign
      </button>

      {/* MODAL */}
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
              w-full max-w-md
              bg-white
              rounded-2xl
              border border-zinc-200
              p-6
            "
          >
            {/* HEADER */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-black">
                Assign Equipment
              </h1>

              <p className="text-sm text-zinc-500 mt-1">Select patient</p>
            </div>

            {/* SELECT */}
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="
                w-full
                border border-zinc-300
                rounded-xl
                px-4 py-3
                outline-none
              "
            >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="
                  border border-zinc-300
                  px-4 py-2
                  rounded-xl
                "
              >
                Cancel
              </button>

              <button
                onClick={assignEquipment}
                className="
                  bg-black text-white
                  px-5 py-2
                  rounded-xl
                "
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
