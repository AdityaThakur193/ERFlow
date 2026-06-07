"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Activity, ShieldCheck, Users, Wrench } from "lucide-react";
import { motion } from "framer-motion";

// Configuration for live simulation feed
const PATIENT_NAMES = ["Marcus Johnson", "Sophia Kim", "Aisha Patel", "Liam O'Connor", "Elena Rostova", "Devon Carter", "Yuki Tanaka"];
const DEPARTMENTS = ["Cardiology", "ICU", "Emergency Treatment", "Pediatrics", "Trauma"];
const EQUIPMENTS = ["GE Ventilator", "Ferno Stretcher", "Bedside Monitor", "Syringe Pump"];
const DOCTORS = ["Dr. Priya Sharma", "Dr. Alan Mitchell", "Dr. Sarah Jenkins", "Dr. Kenji Sato"];

export default function HomePage() {
  const [feed, setFeed] = useState([
    { id: 1, time: "19:33:12", text: "Admitted: Marcus Johnson to Cardiology", status: "Critical" },
    { id: 2, time: "19:30:45", text: "Assigned: Dr. Priya Sharma to Room 104", status: "Active" },
    { id: 3, time: "19:28:02", text: "Deployed: GE Ventilator to Room 101", status: "In Use" },
    { id: 4, time: "19:20:15", text: "Returned: Ferno Stretcher to inventory", status: "Available" },
  ]);

  const [activeCapacity, setActiveCapacity] = useState(12);
  const [equipCapacity, setEquipCapacity] = useState(76);

  // Periodic Log Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const timeStr = date.toTimeString().split(" ")[0];
      
      const roll = Math.random();
      let logText = "";
      let status = "Available";
      
      if (roll < 0.25) {
        const name = PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)];
        const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
        logText = `Admitted: ${name} to ${dept}`;
        status = ["Critical", "High", "Medium"][Math.floor(Math.random() * 3)];
        setActiveCapacity(prev => Math.min(prev + 1, 25));
      } else if (roll < 0.5) {
        const doc = DOCTORS[Math.floor(Math.random() * DOCTORS.length)];
        const room = Math.floor(Math.random() * 12) + 100;
        logText = `Assigned: ${doc} to Room ${room}`;
        status = "Active";
      } else if (roll < 0.75) {
        const equip = EQUIPMENTS[Math.floor(Math.random() * EQUIPMENTS.length)];
        const room = Math.floor(Math.random() * 12) + 100;
        logText = `Deployed: ${equip} to Room ${room}`;
        status = "In Use";
        setEquipCapacity(prev => Math.min(prev + 2, 95));
      } else {
        const name = PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)];
        logText = `Discharged: ${name} (Treatment Complete)`;
        status = "Available";
        setActiveCapacity(prev => Math.max(prev - 1, 5));
        setEquipCapacity(prev => Math.max(prev - 3, 50));
      }

      setFeed(prev => [
        { id: Date.now(), time: timeStr, text: logText, status },
        ...prev.slice(0, 4)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const terminalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 }
    }
  };

  return (
    // FIX: relative so the absolute dot-grid stays contained
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ 
        backgroundColor: "var(--color-bg-primary)", 
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-sans)"
      }}
    >
      {/* Dot Grid Background — fixed to viewport, pointer-events off */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-border-default) 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* All page content sits above dot grid */}
      <div className="relative z-10">

        {/* ── NAVBAR ── */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md border-b"
          style={{
            borderColor: "var(--color-border-light)",
            backgroundColor: "color-mix(in srgb, var(--color-surface-primary) 88%, transparent)",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Wordmark */}
            <div className="flex items-center gap-1">
              <span
                className="text-2xl font-black tracking-tight leading-none"
                style={{ color: "var(--color-accent)", fontFamily: "var(--font-serif)" }}
              >
                ER
              </span>
              <span
                className="text-2xl font-light tracking-tight leading-none"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
              >
                Flow
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="/login"
                className="text-xs sm:text-sm font-semibold transition-colors px-2 py-1.5 sm:px-3 sm:py-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="btn btn-primary text-[10px] sm:text-xs tracking-wide px-3 py-1.5 sm:px-4 sm:py-2"
              >
                Request Access
              </a>
            </div>

          </div>
        </header>

        {/* ── HERO ── */}
        <section className="border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 grid gap-16 lg:grid-cols-12 items-center">
            {/* Left */}
            <motion.div 
              className="lg:col-span-7 space-y-8 text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border"
                style={{
                  borderColor: "var(--color-border-default)",
                  backgroundColor: "var(--color-surface-secondary)",
                  color: "var(--color-text-secondary)",
                }}
                variants={fadeInUpVariants}
              >
                <Activity size={12} className="animate-pulse" style={{ color: "var(--color-success)" }} />
                Emergency Department Operations
              </motion.div>

              <div className="space-y-5">
                <motion.h1
                  className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl max-w-2xl"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
                  variants={fadeInUpVariants}
                >
                  Streamline patient triage and hospital flow.{" "}
                  <span className="italic font-normal" style={{ color: "var(--color-text-secondary)" }}>
                    Designed for modern care.
                  </span>
                </motion.h1>

                <motion.p 
                  className="max-w-xl text-base leading-relaxed" 
                  style={{ color: "var(--color-text-secondary)" }}
                  variants={fadeInUpVariants}
                >
                  ERFlow provides real-time triage visibility, staff assignment tools, and medical device coordination 
                  within a clean, clinical interface designed to reduce administrative stress for hospital operators.
                </motion.p>
              </div>

              <motion.div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto" variants={fadeInUpVariants}>
                <a href="/register" className="btn btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                  Get Access <ArrowRight size={16} />
                </a>
                <a href="/login" className="btn btn-secondary px-6 py-3.5 text-sm flex items-center justify-center w-full sm:w-auto">
                  Sign In to Dashboard
                </a>
              </motion.div>
            </motion.div>

            {/* Right — Live Triage Board Mockup Card */}
            <motion.div 
              className="lg:col-span-5 w-full overflow-hidden"
              variants={terminalVariants}
              initial="hidden"
              animate="visible"
            >
              <div
                className="rounded-xl border p-6 space-y-5 relative overflow-hidden text-left"
                style={{
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface-primary)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                {/* Card Title Bar */}
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[var(--color-danger)] animate-pulse" />
                    <span className="font-bold tracking-wider uppercase font-mono text-[11px]" style={{ color: "var(--color-text-primary)" }}>
                      Triage Board Monitor
                    </span>
                  </div>
                  <span className="uppercase font-semibold text-[10px] tracking-wider font-mono" style={{ color: "var(--color-success)" }}>
                    ● Active Live
                  </span>
                </div>

                {/* Active Priority Bars */}
                <div className="space-y-3">
                  <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Triage Severity Distribution</p>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)] border" style={{ borderColor: "var(--color-border-light)" }}>
                    <div className="bg-[var(--color-danger)] h-full" style={{ width: "35%" }} title="Critical Cases" />
                    <div className="bg-[var(--color-warning)] h-full" style={{ width: "45%" }} title="High Cases" />
                    <div className="bg-[var(--color-info)] h-full" style={{ width: "20%" }} title="Medium/Low Cases" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[var(--color-danger)]" /> Critical (3)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[var(--color-warning)]" /> High (4)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[var(--color-info)]" /> Med/Low (2)</span>
                  </div>
                </div>

                {/* Priority Patient List mockup */}
                <div className="space-y-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Emergency Priority Queue</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: "Marcus Johnson", dept: "Cardiology", priority: "Critical", time: "14m elapsed" },
                      { name: "Aisha Patel", dept: "Pediatrics", priority: "Critical", time: "8m elapsed" },
                      { name: "Sophia Kim", dept: "Emergency", priority: "High", time: "22m elapsed" },
                      { name: "George Thompson", dept: "Trauma", priority: "Medium", time: "31m elapsed" },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2.5 rounded border transition-all hover:translate-x-1" 
                        style={{ 
                          borderColor: "var(--color-border-light)", 
                          backgroundColor: "var(--color-surface-secondary)" 
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            item.priority === "Critical" ? "bg-[var(--color-danger)]" : 
                            item.priority === "High" ? "bg-[var(--color-warning)]" : 
                            "bg-[var(--color-info)]"
                          }`} />
                          <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>{item.name}</span>
                          <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>{item.dept}</span>
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── THE CHALLENGE ── */}
        <section id="challenge" className="border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-4 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-text-tertiary)" }}>
                The Care Delivery bottleneck
              </p>
              <h2 
                className="text-4xl font-black leading-tight" 
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
              >
                &ldquo;In critical care medicine, seconds are the currency of survival.&rdquo;
              </h2>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-end space-y-6 text-left">
              <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Emergency rooms are often slowed down by clunky software interfaces. Without clear real-time visibility into bed availability, physician duty schedules, and vital medical equipment, patient coordination risks delays.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                ERFlow was created to simplify this. We strip away heavy enterprise layouts, returning to clean typography, immediate data input, and instant department coordination that hospital staff can learn without extensive training.
              </p>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-16 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-text-tertiary)" }}>
                Hospital Workflows
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight mt-3" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}>
                Engineered for high-stress environments
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 text-left">
              {/* Card 1 - Patient Board */}
              <motion.div 
                className="lg:col-span-2 card p-8 flex flex-col justify-between"
                style={{ minHeight: "320px" }}
                whileHover={{ y: -6, x: -6, boxShadow: "10px 10px 0px var(--color-border-strong)", borderColor: "var(--color-border-strong)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="max-w-lg space-y-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-success) 10%, transparent)", color: "var(--color-success)" }}>
                    <Users size={20} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Live Patient Triage Board
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)" }}>
                    Monitor triage levels and wait queues from a single dashboard. Patients are automatically sorted by clinical urgency (Critical, High, Medium, Low) using a strict prioritization ranking queue.
                  </p>
                </div>
                
                {/* Mini-table */}
                <div className="mt-8 border rounded-lg overflow-hidden font-mono text-[11px]" style={{ borderColor: "var(--color-border-light)" }}>
                  <div className="grid grid-cols-4 p-2 font-bold uppercase" style={{ backgroundColor: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>
                    <span>Patient</span>
                    <span>Priority</span>
                    <span>Status</span>
                    <span>Doctor</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                    <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>Aisha Patel</span>
                    <span style={{ color: "var(--color-danger)", fontWeight: 700 }}>CRITICAL</span>
                    <span style={{ color: "var(--color-text-secondary)" }}>Waiting</span>
                    <span style={{ color: "var(--color-text-tertiary)" }}>Unassigned</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                    <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>Sophia Kim</span>
                    <span style={{ color: "var(--color-warning)", fontWeight: 700 }}>HIGH</span>
                    <span style={{ color: "var(--color-text-secondary)" }}>In treatment</span>
                    <span style={{ color: "var(--color-text-secondary)" }}>Dr. Mitchell</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Equipment */}
              <motion.div 
                className="card p-8 flex flex-col justify-between"
                style={{ minHeight: "320px" }}
                whileHover={{ y: -6, x: -6, boxShadow: "10px 10px 0px var(--color-border-strong)", borderColor: "var(--color-border-strong)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>
                    <Wrench size={20} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Medical Equipment Allocations
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
                    ICU ventilators, stretchers, and bedside monitors update atomically from stock count when assigned to patients, and restore instantly upon discharge.
                  </p>
                </div>
                <div className="pt-6 font-mono text-xs flex justify-between items-center" style={{ color: "var(--color-text-tertiary)" }}>
                  <span>INVENTORY TRACKING</span>
                  <span className="font-bold" style={{ color: "var(--color-success)" }}>ACTIVE</span>
                </div>
              </motion.div>

              {/* Card 3 - Staff Registry */}
              <motion.div 
                className="lg:col-span-3 card p-8 grid gap-8 md:grid-cols-12"
                style={{ minHeight: "240px" }}
                whileHover={{ y: -6, x: -6, boxShadow: "10px 10px 0px var(--color-border-strong)", borderColor: "var(--color-border-strong)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="md:col-span-7 space-y-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-info) 10%, transparent)", color: "var(--color-info)" }}>
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Secure Staff Access Roles
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)" }}>
                    Onboard receptionists, doctors, and system administrators with specific permissions. Access levels protect patient records and division boards, ensuring secure EMR operations.
                  </p>
                </div>
                <div className="md:col-span-5 flex items-center justify-center border-t md:border-t-0 md:border-l pl-0 md:pl-8" style={{ borderColor: "var(--color-border-light)" }}>
                  <div className="font-mono text-xs space-y-2.5 w-full">
                    <p className="font-semibold text-left" style={{ color: "var(--color-text-primary)" }}>Access Controls:</p>
                    {[
                      "Administration Panel",
                      "Clinical Dashboard",
                      "Patient Directory",
                    ].map((label) => (
                      <p key={label} className="flex justify-between">
                        <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                        <span style={{ color: "var(--color-success)" }}>SECURED</span>
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="operations" className="mx-auto max-w-7xl px-6 pb-24">
          <motion.div
            className="relative rounded-xl p-10 lg:p-16 overflow-hidden border text-left"
            style={{
              backgroundColor: "var(--color-primary)",
              borderColor: "var(--color-primary-active)",
              color: "var(--color-text-inverse)",
              boxShadow: "var(--shadow-xl)",
            }}
            whileHover={{ y: -4, boxShadow: "10px 10px 0px rgba(0, 0, 0, 0.25)" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Dot matrix texture */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ opacity: 0.7 }}>
                  Hospital Deployment
                </p>
                <h2 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  Coordinate emergency operations at your clinic.
                </h2>
                <p className="text-base leading-relaxed" style={{ opacity: 0.8 }}>
                  Deploy ERFlow on local servers or secure hospital intranets. Experience focused patient management free of ads, bloat, or heavy code dependencies.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <motion.a
                  href="/register"
                  className="btn px-6 py-4 text-sm font-bold"
                  style={{
                    backgroundColor: "var(--color-text-inverse)",
                    color: "var(--color-primary)",
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request Access
                </motion.a>
                <motion.a
                  href="/login"
                  className="btn px-6 py-4 text-sm font-semibold"
                  style={{
                    border: "1px solid color-mix(in srgb, var(--color-text-inverse) 30%, transparent)",
                    color: "var(--color-text-inverse)",
                    backgroundColor: "transparent",
                  }}
                  whileHover={{ 
                    backgroundColor: "color-mix(in srgb, var(--color-text-inverse) 10%, transparent)",
                    scale: 1.03
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer 
          className="border-t px-6 py-8 text-xs font-sans"
          style={{
            borderColor: "var(--color-border-light)",
            backgroundColor: "var(--color-surface-secondary)",
            color: "var(--color-text-tertiary)",
          }}
        >
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-black text-sm" style={{ color: "var(--color-accent)", fontFamily: "var(--font-serif)" }}>ER</span>
              <span className="font-light text-sm" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-serif)" }}>Flow</span>
            </div>
            <p>&copy; 2026 ERFlow &bull; Emergency Department Operations Platform</p>
          </div>
        </footer>

      </div>{/* /relative z-10 */}
    </div>
  );
}
