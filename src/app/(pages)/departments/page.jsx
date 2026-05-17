"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function getDepartments() {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.success) setDepartments(data.data || []);
    } catch (error) {
      console.error("FETCH DEPARTMENTS ERROR:", error);
    }
  }

  useEffect(() => {
    getDepartments();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Department name is required"); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Department created");
        setName("");
        setDescription("");
        getDepartments();
      } else {
        toast.error(data.message || "Failed to create department");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this department? Patients/doctors assigned to it will retain the name but it will no longer appear in dropdowns.")) return;
    try {
      const res = await fetch("/api/departments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Department deleted");
        getDepartments();
      } else {
        toast.error("Failed to delete department");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 size={22} style={{ color: "var(--color-primary)" }} />
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Department Management
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Admin only · Departments appear in patient and doctor dropdowns
            </p>
          </div>
        </div>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="label label-required">Department Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Emergency, ICU, Trauma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Description (optional)</label>
            <input
              type="text"
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex items-center gap-2 w-full"
            >
              <Plus size={18} />
              {isSubmitting ? "Creating..." : "Create Department"}
            </button>
          </div>
        </form>
      </div>

      {/* Departments List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {departments.length} Department{departments.length !== 1 ? "s" : ""}
          </h3>
        </div>
        {departments.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>{dept.name}</p>
                  {dept.description && (
                    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>{dept.description}</p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    Created {new Date(dept.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(dept._id)}
                  className="btn btn-icon"
                  title="Delete department"
                >
                  <Trash2 size={16} style={{ color: "var(--color-danger)" }} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              No departments yet. Create one above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
