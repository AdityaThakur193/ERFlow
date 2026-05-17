"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

export default function AddEquipmentModal({ onAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Ventilator",
    roomNumber: "",
    status: "Available",
    inventory: 1,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.inventory < 1) { toast.error("Inventory must be at least 1"); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/addequipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Equipment registered successfully");
        setIsOpen(false);
        setFormData({ name: "", category: "Ventilator", roomNumber: "", status: "Available", inventory: 1 });
        if (onAdded) onAdded();
      } else {
        toast.error(data.message || "Failed to register equipment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-secondary flex items-center gap-2" style={{ fontSize: "0.875rem", fontWeight: "500" }}>
        <Plus size={18} /><span>Add Equipment</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="modal-content">
            <div className="modal-header flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Register Equipment</h2>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Add emergency room medical equipment to inventory</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-icon ml-auto" aria-label="Close modal"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group md:col-span-2">
                  <label className="label label-required">Equipment Name</label>
                  <input type="text" required placeholder="e.g., GE Ventilator Pro X" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
                </div>
                <div className="form-group">
                  <label className="label label-required">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="select">
                    <option value="Ventilator">Ventilator</option>
                    <option value="ECG">ECG Machine</option>
                    <option value="Wheelchair">Wheelchair</option>
                    <option value="Monitor">Patient Monitor</option>
                    <option value="Infusion Pump">Infusion Pump</option>
                    <option value="Oxygen Cylinder">Oxygen Cylinder</option>
                    <option value="Defibrillator">Defibrillator</option>
                    <option value="Suction Unit">Suction Unit</option>
                    <option value="IV Pump">IV Pump</option>
                    <option value="Stretcher">Stretcher</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label label-required">Location</label>
                  <input type="text" required placeholder="e.g., ER-101" value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} className="input" />
                </div>
                {/* ⭐ NEW: Inventory count */}
                <div className="form-group">
                  <label className="label label-required">Inventory Count</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 5"
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 1 })}
                    className="input"
                  />
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                    Total units available in the hospital
                  </p>
                </div>
                <div className="form-group">
                  <label className="label label-required">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="select">
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="modal-footer">
              <button type="button" onClick={() => setIsOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? "Registering..." : "Register Equipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
