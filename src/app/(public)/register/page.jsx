"use client";

import Link from "next/link";
import { ShieldCheck, Users, KeyRound, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Building2,
    title: "Your hospital deploys ERFlow",
    description:
      "ERFlow is deployed and configured by your hospital IT or operations team on a local server or private intranet.",
  },
  {
    icon: ShieldCheck,
    title: "Your admin creates your account",
    description:
      "A system Administrator registers your account with the correct role — Doctor, Receptionist, or Admin — inside the Staff Registry panel.",
  },
  {
    icon: KeyRound,
    title: "You sign in with provided credentials",
    description:
      "Once your account exists, you can sign in directly from the login page. No self-registration is available — this keeps patient data secure.",
  },
];

export default function RequestAccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
            >
              <span style={{ color: "var(--color-accent)" }}>ER</span>Flow
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider mb-4 border"
            style={{
              borderColor: "var(--color-border-default)",
              backgroundColor: "var(--color-surface-secondary)",
              color: "var(--color-text-tertiary)",
            }}
          >
            <Users size={11} />
            Access Information
          </div>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-serif)" }}
          >
            How to get access
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            ERFlow is a closed clinical system. Accounts are not self-registered — they are provisioned by your hospital&apos;s system administrator.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                className="flex gap-4 p-4 rounded-xl border"
                style={{
                  borderColor: "var(--color-border-light)",
                  backgroundColor: "var(--color-surface-primary)",
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.15, type: "spring", stiffness: 120, damping: 18 }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Step {i + 1}
                    </span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {step.title}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-surface-secondary)",
          }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Already have an account?
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Sign in using the credentials your administrator provided.
            </p>
          </div>
          <Link
            href="/login"
            className="btn btn-primary text-sm flex items-center gap-2 shrink-0"
          >
            Sign In <ArrowRight size={14} />
          </Link>
        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            ← Back to ERFlow
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
