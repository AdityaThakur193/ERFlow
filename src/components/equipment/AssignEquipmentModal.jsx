"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Package } from "lucide-react";

export default function AssignEquipmentModal({ equipmentId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);

  async function getPatients() {
    try {
      const response = await fetch("/api/addpatient");
      const data = await response.json();

      if (data.success) {
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error("FETCH PATIENTS ERROR:", error);
      toast.error("Failed to load patients");
    }
  }

  useEffect(() => {
    if (isOpen) {
      getPatients();
    }
  }, [isOpen]);

  async function assignEquipment() {
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    setLoading(true);
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
        toast.success("Equipment assigned successfully");
        setIsOpen(false);
        window.location.reload();
      } else {
        toast.error("Failed to assign equipment");
      }
    } catch (error) {
      console.error("ASSIGN EQUIPMENT ERROR:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary text-xs py-1.5 flex items-center gap-1"
      >
        <Package size={14} />
        Assign
      </button>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header flex items-start justify-between">
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Assign Equipment
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Select a patient to assign this equipment to
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-icon ml-auto"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="form-group">
                <label className="label label-required">Select Patient</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="select"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} — {patient.department} ({patient.priority})
                    </option>
                  ))}
                </select>
                {patients.length === 0 && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    No patients available
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={assignEquipment}
                disabled={loading || !selectedPatient || patients.length === 0}
                className="btn btn-primary"
              >
                {loading ? "Assigning..." : "Assign Equipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
