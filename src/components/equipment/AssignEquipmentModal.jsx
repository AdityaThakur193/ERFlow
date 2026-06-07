"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/providors/CustomToast";
import { X, Package } from "lucide-react";

export default function AssignEquipmentModal({ equipmentId, equipmentName, inventory, onAssigned }) {
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);

  async function getActivePatients() {
    try {
      const response = await fetch("/api/addpatient");
      const data = await response.json();
      if (data.success) {
        // Only show active (non-completed) patients
        const active = (data.data || []).filter((p) => p.status !== "Completed");
        setPatients(active);
      }
    } catch (error) {
      toast.error("Failed to load patients");
    }
  }

  useEffect(() => {
    if (isOpen) {
      getActivePatients();
      setSelectedPatient("");
    }
  }, [isOpen]);

  async function assignEquipment() {
    if (!selectedPatient) { toast.error("Please select a patient"); return; }
    if (inventory <= 0) { toast.error("No inventory remaining for this equipment"); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/addequipment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: equipmentId,
          action: "assign",
          assignedPatient: selectedPatient,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Equipment assigned successfully");
        setIsOpen(false);
        if (onAssigned) onAssigned();
      } else {
        toast.error(data.message || "Failed to assign equipment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // If inventory is 0, show disabled button
  const isOutOfStock = inventory <= 0;

  return (
    <>
      <button
        onClick={() => !isOutOfStock && setIsOpen(true)}
        disabled={isOutOfStock}
        className="btn btn-primary text-xs py-1.5 flex items-center gap-1"
        title={isOutOfStock ? "Out of stock" : "Assign to patient"}
      >
        <Package size={14} />
        {isOutOfStock ? "Out of Stock" : "Assign"}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="modal-content" data-lenis-prevent>
            <div className="modal-header flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Assign Equipment</h2>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  {equipmentName} · <span style={{ color: "var(--color-success)" }}>{inventory} unit{inventory !== 1 ? "s" : ""} available</span>
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-icon ml-auto" aria-label="Close modal"><X size={20} /></button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="label label-required">Select Active Patient</label>
                <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="select">
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} — {patient.department} ({patient.priority}) [{patient.status}]
                    </option>
                  ))}
                </select>
                {patients.length === 0 && (
                  <p className="text-sm mt-2" style={{ color: "var(--color-text-tertiary)" }}>No active patients available</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setIsOpen(false)} className="btn btn-secondary" disabled={loading}>Cancel</button>
              <button onClick={assignEquipment} disabled={loading || !selectedPatient} className="btn btn-primary">
                {loading ? "Assigning..." : "Assign Equipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
