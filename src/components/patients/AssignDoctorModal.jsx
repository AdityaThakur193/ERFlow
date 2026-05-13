"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Stethoscope } from "lucide-react";

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
        const available = data.data.filter((d) => d.status === "Available");
        setDoctors(available);
      }
    } catch (error) {
      console.error("FETCH DOCTORS ERROR:", error);
      toast.error("Failed to load doctors");
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDoctors();
    }
  }, [isOpen]);

  async function handleAssign() {
    if (!selectedDoctor) {
      toast.error("Please select a doctor");
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
        toast.success("Doctor assigned successfully!");
        setIsOpen(false);
        setSelectedDoctor("");
        if (onAssigned) onAssigned();
      } else {
        toast.error(data.message || "Failed to assign doctor");
      }
    } catch (error) {
      console.error("ASSIGN DOCTOR ERROR:", error);
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
        <Stethoscope size={14} />
        Assign Doctor
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
                  Assign Doctor
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Select an available physician to treat this patient
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
                <label className="label label-required">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="select"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} — {doc.specialization} (Room {doc.roomNumber})
                    </option>
                  ))}
                </select>
                {doctors.length === 0 && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--color-warning)" }}
                  >
                    ⚠️ No doctors are available at this time. Please try again later.
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
                onClick={handleAssign}
                disabled={loading || !selectedDoctor || doctors.length === 0}
                className="btn btn-primary"
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
