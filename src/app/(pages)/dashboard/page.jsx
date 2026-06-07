"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, AlertTriangle, Clock3, Building2, HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load HUD collapse preference from localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem("erflow_hud_collapsed");
    // If no saved preference yet, auto-collapse when there are patients
    if (collapsed === null) {
      // Will be updated after data loads (see below)
    } else {
      setHudCollapsed(collapsed === "true");
    }
  }, []);

  const toggleHud = () => {
    const nextCollapsed = !hudCollapsed;
    setHudCollapsed(nextCollapsed);
    localStorage.setItem("erflow_hud_collapsed", String(nextCollapsed));
  };

  const getPatients = useCallback(async () => {
    try {
      const response = await fetch("/api/addpatient");
      const data = await response.json();
      if (data.success) {
        setPatients(data.data || []);
      }
    } catch (error) {
      console.log("FETCH PATIENT ERROR:", error);
    }
  }, []);

  const getEquipment = useCallback(async () => {
    try {
      const response = await fetch("/api/addequipment");
      const data = await response.json();
      if (data.success) {
        setEquipment(data.data || []);
      }
    } catch (error) {
      console.log("FETCH EQUIPMENT ERROR:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    const [pData, eData] = await Promise.all([getPatients(), getEquipment()]);
    setLoading(false);
    // Auto-collapse HUD on first visit if patients already exist
    const savedPref = localStorage.getItem("erflow_hud_collapsed");
    if (savedPref === null) {
      // pData is not returned by helpers, read the state via a short timeout
      setTimeout(() => {
        setPatients((current) => {
          if (current.length > 0) {
            setHudCollapsed(true);
          }
          return current;
        });
      }, 0);
    }
  }, [getPatients, getEquipment]);

  useEffect(() => {
    loadData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Count active patients (exclude Completed)
  const activePatients = patients.filter(
    (p) => p.status === "Waiting" || p.status === "In treatment"
  );

  const totalPatients = activePatients.length;
  const criticalPatients = activePatients.filter(
    (p) => p.priority === "Critical"
  ).length;
  const waitingPatients = activePatients.filter(
    (p) => p.status === "Waiting"
  ).length;
  const departmentsActive = new Set(
    activePatients.map((p) => p.department).filter(Boolean)
  ).size;

  // Onboarding Checklist Criteria
  const hasPatients = patients.length > 0;
  const hasTreatment = patients.some((p) => p.status === "In treatment");
  const hasEquipment = equipment.some((e) => e.status === "In Use");

  const completedSteps = [hasPatients, hasTreatment, hasEquipment].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / 3) * 100);

  function navigateFiltered(filter) {
    router.push(`/patients?filter=${filter}`);
  }

  // Sort queue by priority order: Critical -> High -> Medium -> Low
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const sortedPatients = [...activePatients].sort((a, b) => {
    return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* ── CENTRAL HUD CLINICAL ONBOARDING CONSOLE ── */}
      <motion.section 
        className="card-elevated p-5 relative overflow-hidden border-2"
        style={{ borderColor: "var(--color-border-strong)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Decorative Grid Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]" />
        
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-[var(--color-accent)] animate-pulse" />
            <div>
              <h2 className="text-md font-bold tracking-tight font-serif" style={{ color: "var(--color-text-primary)" }}>
                Emergency Department Operations Guide
              </h2>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
                Operational checklist: {completedSteps} of 3 steps completed
              </p>
            </div>
          </div>
          
          <button 
            onClick={toggleHud} 
            className="btn btn-secondary !py-1 !px-2 text-[10px] font-semibold flex items-center gap-1.5"
            style={{ borderRadius: "var(--radius-sm)" }}
          >
            {hudCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            <span>{hudCollapsed ? "Expand Guide" : "Collapse Guide"}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-bg-tertiary)] h-1.5 rounded-full mt-3 overflow-hidden border" style={{ borderColor: "var(--color-border-light)" }}>
          <motion.div 
            className="h-full bg-[var(--color-accent)]" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Expandable Checklist Section */}
        <AnimatePresence initial={false}>
          {!hudCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4" style={{ borderColor: "var(--color-border-light)" }}>
                {/* Step 1 */}
                <div 
                  className={`p-3.5 rounded border transition-all duration-300 ${
                    hasPatients ? "bg-teal-50/10 border-teal-500/30" : "bg-transparent border-[var(--color-border-default)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {hasPatients ? (
                      <CheckCircle2 size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-[var(--color-text-tertiary)] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-bold font-serif" style={{ color: hasPatients ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                        1. Triage a New Patient
                      </p>
                      <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                        Admit and register incoming cases. Click <span className="font-bold text-[var(--color-accent)]">Add Patient</span> in the top-right header to create a triage record.
                      </p>
                      {!hasPatients && (
                        <span className="inline-block text-[9px] font-sans font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/25 px-1 py-0.5 rounded mt-2 uppercase tracking-wide">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div 
                  className={`p-3.5 rounded border transition-all duration-300 ${
                    hasTreatment ? "bg-teal-50/10 border-teal-500/30" : "bg-transparent border-[var(--color-border-default)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {hasTreatment ? (
                      <CheckCircle2 size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-[var(--color-text-tertiary)] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-bold font-serif" style={{ color: hasTreatment ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                        2. Assign a Physician
                      </p>
                      <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                        Assign an active doctor to a patient to move status to <span className="font-bold">In treatment</span>. Go to the <span className="underline">Patients</span> tab to select and edit.
                      </p>
                      {hasPatients && !hasTreatment && (
                        <span className="inline-block text-[9px] font-sans font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/25 px-1 py-0.5 rounded mt-2 uppercase tracking-wide">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div 
                  className={`p-3.5 rounded border transition-all duration-300 ${
                    hasEquipment ? "bg-teal-50/10 border-teal-500/30" : "bg-transparent border-[var(--color-border-default)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {hasEquipment ? (
                      <CheckCircle2 size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-[var(--color-text-tertiary)] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-bold font-serif" style={{ color: hasEquipment ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                        3. Allocate Clinical Equipment
                      </p>
                      <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                        Deploy and link medical resources (Ventilators, Stretchers) to patient rooms. Go to <span className="underline">Equipment</span> tab to link inventory.
                      </p>
                      {hasTreatment && !hasEquipment && (
                        <span className="inline-block text-[9px] font-sans font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/25 px-1 py-0.5 rounded mt-2 uppercase tracking-wide">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ── METRICS COUNTUP BENTO GRID ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 - Total Active */}
        <motion.div
          className="metric-card metric-card-1 cursor-pointer"
          onClick={() => navigateFiltered("active")}
          title="Click to view all active patients"
          whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Total Active Patients</p>
              <h2 className="text-4xl font-bold mt-3">{loading ? "..." : totalPatients}</h2>
            </div>
            <div className="metric-icon">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs mt-2 opacity-75">
            Waiting + In treatment (excludes completed)
          </p>
        </motion.div>

        {/* Card 2 - Critical */}
        <motion.div
          className="metric-card metric-card-2 cursor-pointer"
          onClick={() => navigateFiltered("Critical")}
          title="Click to view critical patients"
          whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Critical Patients</p>
              <h2 className="text-4xl font-bold mt-3 text-[var(--color-danger)]">{loading ? "..." : criticalPatients}</h2>
            </div>
            <div className="metric-icon text-[var(--color-danger)]">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-xs mt-2 opacity-75">
            Immediate attention triage priority cases
          </p>
        </motion.div>

        {/* Card 3 - Waiting */}
        <motion.div
          className="metric-card metric-card-3 cursor-pointer"
          onClick={() => navigateFiltered("Waiting")}
          title="Click to view waiting patients"
          whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Waiting Patients</p>
              <h2 className="text-4xl font-bold mt-3 text-[var(--color-warning)]">{loading ? "..." : waitingPatients}</h2>
            </div>
            <div className="metric-icon text-[var(--color-warning)]">
              <Clock3 size={20} />
            </div>
          </div>
          <p className="text-xs mt-2 opacity-75">
            Patients waiting for physician allocations
          </p>
        </motion.div>

        {/* Card 4 - Departments */}
        <motion.div 
          className="metric-card metric-card-4"
          whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-80">Departments Active</p>
              <h2 className="text-4xl font-bold mt-3 text-[var(--color-success)]">{loading ? "..." : departmentsActive}</h2>
            </div>
            <div className="metric-icon text-[var(--color-success)]">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-xs mt-2 opacity-75">
            Hospital wards actively treating cases
          </p>
        </motion.div>
      </section>

      {/* ── EMERGENCY QUEUE LEDGER ── */}
      <motion.section 
        className="card rounded-xl p-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold font-serif" style={{ color: "var(--color-text-primary)" }}>
              Emergency Queue
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Active patients sorted by priority · Live console updates every 10s
            </p>
          </div>
        </div>

        <div className="table-container w-full overflow-x-auto">
          <table className="table w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="pb-4">Patient</th>
                <th className="pb-4">Age</th>
                <th className="pb-4">Symptoms</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Department</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AnimatePresence mode="popLayout">
                {sortedPatients.map((patient) => (
                  <motion.tr 
                    key={patient._id}
                    layoutId={patient._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  >
                    <td className="py-4 font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {patient.name}
                    </td>
                    <td style={{ color: "var(--color-text-secondary)" }}>{patient.age}</td>
                    <td>
                      <span className="block max-w-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                        {patient.symptoms}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        patient.priority === "Critical" ? "badge-critical" :
                        patient.priority === "High" ? "badge-high" :
                        patient.priority === "Medium" ? "badge-medium" : "badge-low"
                      }`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td style={{ color: "var(--color-text-secondary)" }}>{patient.department}</td>
                    <td>
                      <span className={`badge ${patient.status === "Waiting" ? "badge-busy" : "badge-active"}`}>
                        {patient.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {!loading && sortedPatients.length === 0 && (
            <motion.div 
              className="py-16 text-center text-sm" 
              style={{ color: "var(--color-text-tertiary)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No active patients in the queue
            </motion.div>
          )}

          {loading && (
            <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--color-text-tertiary)" }}>
              POLLING CONSOLE OPERATIONS DATA...
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
