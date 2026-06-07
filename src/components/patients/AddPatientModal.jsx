"use client";
import { toast } from "@/components/providors/CustomToast";
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

export default function AddPatientModal({ onAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
    priority: "Medium",
    department: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dynamic departments from DB
  async function fetchDepartments() {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.success) {
        setDepartments(data.data || []);
        // Pre-select first department
        if (data.data.length > 0) {
          setFormData((prev) => ({ ...prev, department: data.data[0].name }));
        }
      }
    } catch (error) {
      console.error("FETCH DEPARTMENTS ERROR:", error);
    }
  }

  useEffect(() => {
    if (isOpen) fetchDepartments();
  }, [isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.department) {
      toast.error("Please select a department");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addpatient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        toast.success("Patient registered successfully");
        setIsOpen(false);
        setFormData({
          name: "",
          age: "",
          gender: "Male",
          symptoms: "",
          priority: "Medium",
          department: departments[0]?.name || "",
        });
        if (onAdded) onAdded();
      } else {
        toast.error(data.message || "Failed to add patient");
      }
    } catch (error) {
      console.error("ADD PATIENT ERROR:", error);
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
        className="btn btn-primary flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm shrink-0"
        title="Register incoming patient"
        aria-label="Register patient"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Add Patient</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="modal-content" data-lenis-prevent>
            {/* Header */}
            <div className="modal-header flex items-start justify-between">
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Register Emergency Patient
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Create a new patient entry in the emergency system
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
                {/* Patient Name */}
                <div className="form-group">
                  <label className="label label-required">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient's full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Age */}
                <div className="form-group">
                  <label className="label label-required">Age</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="150"
                    placeholder="Enter patient's age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="label label-required">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Priority Level */}
                <div className="form-group">
                  <label className="label label-required">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Department - dynamic from DB */}
                <div className="form-group md:col-span-2">
                  <label className="label label-required">Department</label>
                  {departments.length > 0 ? (
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="select"
                    >
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-warning)" }}
                    >
                      ⚠️ No departments found. An Admin must create departments first.
                    </p>
                  )}
                </div>

                {/* Symptoms */}
                <div className="form-group md:col-span-2">
                  <label className="label label-required">Presenting Symptoms</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe patient's symptoms and chief complaint"
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData({ ...formData, symptoms: e.target.value })
                    }
                    className="textarea"
                  />
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
                onClick={handleSubmit}
                disabled={isSubmitting || departments.length === 0}
                className="btn btn-primary"
              >
                {isSubmitting ? "Adding..." : "Register Patient"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
