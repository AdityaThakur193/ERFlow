"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function AddPatientModal() {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
    priority: "Medium",
    department: "Emergency",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addpatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Patient added successfully");
        setIsOpen(false);
        setFormData({
          name: "",
          age: "",
          gender: "Male",
          symptoms: "",
          priority: "Medium",
          department: "Emergency",
        });
      } else {
        toast.error("Failed to add patient");
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
        className="btn btn-primary flex items-center gap-2"
        style={{ 
          fontSize: "0.875rem",
          fontWeight: "500",
        }}
      >
        <Plus size={18} />
        <span>Add Patient</span>
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

                {/* Department */}
                <div className="form-group">
                  <label className="label label-required">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="select"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="ICU">Intensive Care</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General">General Ward</option>
                  </select>
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
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
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
