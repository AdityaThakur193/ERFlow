"use client";

import { useEffect, useState } from "react";
import { Trash2, UserPlus, Users, ShieldCheck, Stethoscope, ClipboardList, Search } from "lucide-react";
import { toast } from "@/components/providors/CustomToast";
import AddStaffModal from "@/components/staff/AddStaffModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const POSITION_CONFIG = {
  Admin: {
    icon: ShieldCheck,
    badgeClass: "badge-danger",
    color: "var(--color-danger)",
  },
  Doctor: {
    icon: Stethoscope,
    badgeClass: "badge-info",
    color: "var(--color-info)",
  },
  Receptionist: {
    icon: ClipboardList,
    badgeClass: "badge-success",
    color: "var(--color-success)",
  },
};

export default function StaffPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
      } else {
        toast.error(data.message || "Failed to load staff");
      }
    } catch {
      toast.error("Could not load staff list");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.success) setCurrentUser(data.user);
    } catch {}
  }

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  async function handleDelete(id, username) {
    setDeletingId(id);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${username} has been removed`);
        fetchUsers();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || u.position === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((u) => u.position === "Admin").length;
  const doctorCount = users.filter((u) => u.position === "Doctor").length;
  const receptionistCount = users.filter((u) => u.position === "Receptionist").length;

  return (
    <div className="space-y-6">
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Staff Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Create and manage hospital staff accounts
          </p>
        </div>
        <AddStaffModal onAdded={fetchUsers} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Staff", value: users.length, icon: Users, color: "var(--color-primary)" },
          { label: "Doctors", value: doctorCount, icon: Stethoscope, color: "var(--color-info)" },
          { label: "Receptionists", value: receptionistCount, icon: ClipboardList, color: "var(--color-success)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-6 flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                {label}
              </p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: "var(--color-text-primary)" }}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-tertiary)" }}
            />
            <input
              id="staff-search"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select
            id="staff-role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="select sm:w-48"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card overflow-hidden">
        <div
          className="p-6 flex items-center justify-between border-b"
          style={{ borderColor: "var(--color-border-light)" }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
              Staff Directory
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}
              {filterRole !== "All" ? ` · ${filterRole}` : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <p style={{ color: "var(--color-text-tertiary)" }}>Loading staff...</p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block table-container" style={{ border: "none", borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const config = POSITION_CONFIG[user.position] || POSITION_CONFIG.Receptionist;
                    const RoleIcon = config.icon;
                    const isCurrentUser = currentUser?.id === String(user._id);

                    return (
                      <tr key={user._id}>
                        {/* Name + Avatar */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${config.color} 16%, transparent)`,
                                color: config.color,
                              }}
                            >
                              {user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                {user.username}
                                {isCurrentUser && (
                                  <span
                                    className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                                      color: "var(--color-primary-active)",
                                    }}
                                  >
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                                ID: {String(user._id).substring(0, 8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td>
                          <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                            {user.email}
                          </span>
                        </td>

                        {/* Role Badge */}
                        <td>
                          <span
                            className="badge flex items-center gap-1.5 w-fit"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
                              color: config.color,
                            }}
                          >
                            <RoleIcon size={12} />
                            {user.position}
                          </span>
                        </td>

                        {/* Joined date */}
                        <td>
                          <span className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          {isCurrentUser ? (
                            <span className="text-xs" style={{ color: "var(--color-text-disabled)" }}>
                              —
                            </span>
                          ) : (
                            <button
                              id={`delete-user-${user._id}`}
                              onClick={() => setConfirm({
                                title: "Remove Staff Member",
                                message: `Remove "${user.username}" from the system? This cannot be undone.`,
                                confirmLabel: "Remove",
                                isDanger: true,
                                onConfirm: () => handleDelete(user._id, user.username),
                              })}
                              disabled={deletingId === user._id}
                              className="btn-icon"
                              title={`Remove ${user.username}`}
                              aria-label={`Remove ${user.username}`}
                            >
                              <Trash2
                                size={15}
                                color={deletingId === user._id ? "var(--color-text-disabled)" : "var(--color-danger)"}
                              />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-[var(--color-border-light)]">
              {filtered.map((user) => {
                const config = POSITION_CONFIG[user.position] || POSITION_CONFIG.Receptionist;
                const RoleIcon = config.icon;
                const isCurrentUser = currentUser?.id === String(user._id);

                return (
                  <div key={user._id} className="p-4 space-y-3 text-left">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${config.color} 16%, transparent)`,
                            color: config.color,
                          }}
                        >
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-base flex items-center gap-1.5" style={{ color: "var(--color-text-primary)" }}>
                            {user.username}
                            {isCurrentUser && (
                              <span
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                                  color: "var(--color-primary-active)",
                                }}
                              >
                                You
                              </span>
                            )}
                          </h3>
                          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                            ID: {String(user._id).substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span
                        className="badge flex items-center gap-1.5 text-xs font-medium"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
                          color: config.color,
                        }}
                      >
                        <RoleIcon size={11} />
                        {user.position}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      <div>
                        <span className="font-semibold block text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>Email:</span>
                        <p className="mt-0.5 truncate">{user.email}</p>
                      </div>
                      <div>
                        <span className="font-semibold block text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>Joined:</span>
                        <p className="mt-0.5">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-[var(--color-border-light)]">
                      {isCurrentUser ? (
                        <span className="text-xs" style={{ color: "var(--color-text-disabled)" }}>
                          —
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirm({
                            title: "Remove Staff Member",
                            message: `Remove "${user.username}" from the system? This cannot be undone.`,
                            confirmLabel: "Remove",
                            isDanger: true,
                            onConfirm: () => handleDelete(user._id, user.username),
                          })}
                          disabled={deletingId === user._id}
                          className="btn-icon"
                          title={`Remove ${user.username}`}
                          aria-label={`Remove ${user.username}`}
                        >
                          <Trash2
                            size={15}
                            color={deletingId === user._id ? "var(--color-text-disabled)" : "var(--color-danger)"}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <UserPlus size={40} className="mx-auto mb-3" style={{ color: "var(--color-text-disabled)" }} />
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {search || filterRole !== "All" ? "No staff match your filters" : "No staff accounts yet"}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              {!search && filterRole === "All" && "Use the Add Staff button to create the first account."}
            </p>
          </div>
        )}
      </div>

      {/* Password reminder banner */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3 border"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-warning) 10%, transparent)",
          borderColor: "color-mix(in srgb, var(--color-warning) 25%, transparent)",
        }}
      >
        <span className="text-lg shrink-0">🔑</span>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-text-primary)" }}>Sharing credentials:</strong>{" "}
          After creating an account, share the staff member&apos;s email and password directly in person
          or via your internal communication channel (e.g., WhatsApp, Slack). Remind them to keep
          their password private.
        </p>
      </div>
    </div>
  );
}
