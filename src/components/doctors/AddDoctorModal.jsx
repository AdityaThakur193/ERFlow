"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

export default function AddDoctorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "Emergency Medicine",
    roomNumber: "",
    status: "Available",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

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
        toast.success("Doctor registered successfully");
        setIsOpen(false);
        setFormData({
          name: "",
          specialization: "Emergency Medicine",
          roomNumber: "",
          status: "Available",
        });
        window.location.reload();
      } else {
        toast.error("Failed to register doctor");
      }
    } catch (error) {
      console.error("ADD DOCTOR ERROR:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-info flex items-center gap-2"
        style={{ 
          fontSize: "0.875rem",
          fontWeight: "500",
        }}
      >
        <Plus size={18} />
        <span>Add Doctor</span>
      </button>

      {/* Modal */}
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
                  Register Doctor
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Add a new physician to the emergency department
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Doctor Name */}
                <div className="form-group md:col-span-2">
                  <label className="label label-required">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. James Smith"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Specialization */}
                <div className="form-group">
                  <label className="label label-required">Specialization</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    className="select"
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

                {/* Room Number */}
                <div className="form-group">
                  <label className="label label-required">Room/Station</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ER-101"
                    value={formData.roomNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNumber: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Status */}
                <div className="form-group md:col-span-2">
                  <label className="label label-required">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="select"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Break">On Break</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? "Registering..." : "Register Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
