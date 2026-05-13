"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

export default function AddEquipmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Ventilator",
    roomNumber: "",
    status: "Available",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addequipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Equipment registered successfully");
        setIsOpen(false);
        setFormData({
          name: "",
          category: "Ventilator",
          roomNumber: "",
          status: "Available",
        });
      } else {
        toast.error("Failed to register equipment");
      }
    } catch (error) {
      console.error("ADD EQUIPMENT ERROR:", error);
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
        className="btn btn-secondary flex items-center gap-2"
        style={{ 
          fontSize: "0.875rem",
          fontWeight: "500",
        }}
      >
        <Plus size={18} />
        <span>Add Equipment</span>
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
                  Register Equipment
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Add emergency room medical equipment
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
                {/* Equipment Name */}
                <div className="form-group md:col-span-2">
                  <label className="label label-required">Equipment Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., GE Ventilator Pro X"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="label label-required">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="select"
                  >
                    <option value="Ventilator">Ventilator</option>
                    <option value="ECG">ECG Machine</option>
                    <option value="Wheelchair">Wheelchair</option>
                    <option value="Monitor">Patient Monitor</option>
                    <option value="Infusion Pump">Infusion Pump</option>
                    <option value="Oxygen Cylinder">Oxygen Cylinder</option>
                    <option value="Defibrillator">Defibrillator</option>
                    <option value="Suction Unit">Suction Unit</option>
                  </select>
                </div>

                {/* Room/Location */}
                <div className="form-group">
                  <label className="label label-required">Location</label>
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
                  <label className="label label-required">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="select"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Offline">Offline</option>
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
                {isSubmitting ? "Registering..." : "Register Equipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
