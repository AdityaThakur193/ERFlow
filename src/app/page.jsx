"use client";

const features = [
  {
    title: "Real-Time Patient Tracking",
    description:
      "Monitor admissions, treatment progress, and emergency response workflows from one centralized dashboard.",
  },
  {
    title: "Staff Coordination",
    description:
      "Manage doctors, nurses, and emergency teams efficiently during high-pressure operations.",
  },
  {
    title: "Equipment Monitoring",
    description:
      "Track ICU beds, ambulances, ventilators, and emergency equipment instantly.",
  },
];

const stats = [
  { value: "24/7", label: "Emergency Monitoring" },
  { value: "99.9%", label: "System Reliability" },
  { value: "4x", label: "Faster Coordination" },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}
    >
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{
          borderBottom: "1px solid var(--color-border-light)",
          backgroundColor: "color-mix(in srgb, var(--color-surface-primary) 90%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            ERFlow
          </h1>

          <nav className="hidden items-center gap-8 md:flex">
            {["#features", "#operations", "#performance"].map((href) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium transition"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--color-text-primary)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--color-text-secondary)")}
              >
                {href.replace("#", "").charAt(0).toUpperCase() + href.slice(2)}
              </a>
            ))}
          </nav>

          <a
            href="/login"
            className="btn btn-primary px-5 py-2.5 text-sm"
          >
            Staff Login
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 40%), linear-gradient(180deg, var(--color-bg-primary), var(--color-bg-secondary))",
          }}
        />

        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left */}
          <div className="space-y-8">
            <div
              className="inline-flex rounded-full px-4 py-2 text-sm font-medium"
              style={{
                border: "1px solid var(--color-border-default)",
                backgroundColor: "var(--color-surface-primary)",
                color: "var(--color-text-secondary)",
              }}
            >
              Emergency Room Management Platform
            </div>

            <div className="space-y-6">
              <h1
                className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                Smarter Emergency Coordination for Modern Hospitals
              </h1>

              <p className="max-w-2xl text-lg leading-8" style={{ color: "var(--color-text-secondary)" }}>
                ERFlow helps hospitals manage emergency operations with real-time patient tracking,
                staff coordination, and equipment monitoring from one reliable dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="/login" className="btn btn-primary px-7 py-4 text-base">
                Access Dashboard
              </a>
              <a
                href="#features"
                className="btn btn-secondary px-7 py-4 text-base"
              >
                Explore Features
              </a>
            </div>

            {/* Stats */}
            <div id="performance" className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="card p-5"
                >
                  <h3 className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {item.value}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Preview */}
          <div
            className="rounded-[2rem] p-6"
            style={{
              border: "1px solid var(--color-border-light)",
              backgroundColor: "var(--color-surface-primary)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div
              className="flex items-center justify-between pb-4"
              style={{ borderBottom: "1px solid var(--color-border-light)" }}
            >
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Emergency Dashboard
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  Live Hospital Status
                </p>
              </div>
              <span
                className="badge badge-active"
              >
                Active
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div
                className="rounded-2xl p-5"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>Active Patients</p>
                <h2 className="mt-1 text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>128</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
                  <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>Doctors On Duty</p>
                  <h3 className="mt-2 text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>42</h3>
                </div>
                <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
                  <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>ICU Beds Available</p>
                  <h3 className="mt-2 text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>18</h3>
                </div>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-text-inverse)" }}
              >
                <p className="text-sm" style={{ opacity: 0.8 }}>Emergency Status</p>
                <h3 className="mt-2 text-2xl font-bold">Stable Operations</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Platform Features
          </p>
          <h2
            className="mt-4 text-4xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Built for Fast-Paced Emergency Departments
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8" style={{ color: "var(--color-text-secondary)" }}>
            ERFlow simplifies emergency room coordination with patient tracking,
            staff management, and equipment visibility.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="mb-5 h-1.5 w-14 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              <h3 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                {feature.title}
              </h3>
              <p className="mt-4 text-[15px] leading-7" style={{ color: "var(--color-text-secondary)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="operations" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div
          className="rounded-[2.5rem] p-10 lg:p-16"
          style={{
            backgroundColor: "var(--color-primary-active)",
            color: "var(--color-text-inverse)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.24em]"
                style={{ opacity: 0.7 }}
              >
                Emergency Coordination
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight">
                Improve hospital response efficiency with ERFlow.
              </h2>
              <p className="mt-5 text-lg leading-8" style={{ opacity: 0.8 }}>
                Designed for emergency departments that require fast, reliable,
                and organized workflows during critical situations.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <a
                href="/login"
                className="btn px-7 py-4 text-base font-semibold"
                style={{
                  backgroundColor: "var(--color-text-inverse)",
                  color: "var(--color-primary-active)",
                }}
              >
                Launch Dashboard
              </a>
              <a
                href="#features"
                className="btn px-7 py-4 text-base font-semibold"
                style={{
                  border: "1px solid color-mix(in srgb, var(--color-text-inverse) 30%, transparent)",
                  color: "var(--color-text-inverse)",
                  backgroundColor: "transparent",
                }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
