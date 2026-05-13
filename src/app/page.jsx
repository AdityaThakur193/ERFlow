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
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ERFlow
          </h1>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-black"
            >
              Features
            </a>

            <a
              href="#operations"
              className="text-sm font-medium text-slate-600 transition hover:text-black"
            >
              Operations
            </a>

            <a
              href="#performance"
              className="text-sm font-medium text-slate-600 transition hover:text-black"
            >
              Performance
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Staff Login
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" />

        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* Left */}
          <div className="space-y-8">

            <div className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Emergency Room Management Platform
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                Smarter Emergency Coordination for Modern Hospitals
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                ERFlow helps hospitals manage emergency operations with
                real-time patient tracking, staff coordination, and equipment
                monitoring from one reliable dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">

              <a
                href="/login"
                className="rounded-2xl bg-slate-900 px-7 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
              >
                Access Dashboard
              </a>

              <a
                href="#features"
                className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Features
              </a>

            </div>

            {/* Stats */}
            <div
              id="performance"
              className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3"
            >
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-3xl font-bold text-slate-900">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Dashboard Preview */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Emergency Dashboard
                </h3>

                <p className="text-sm text-slate-500">
                  Live Hospital Status
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                Active
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl bg-slate-100 p-5">
                <p className="text-sm text-slate-500">
                  Active Patients
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  128
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-100 p-5">
                  <p className="text-sm text-slate-500">
                    Doctors On Duty
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    42
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5">
                  <p className="text-sm text-slate-500">
                    ICU Beds Available
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    18
                  </h3>
                </div>

              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-white">

                <p className="text-sm text-slate-300">
                  Emergency Status
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Stable Operations
                </h3>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >

        <div className="mb-14 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Platform Features
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Built for Fast-Paced Emergency Departments
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            ERFlow simplifies emergency room coordination with patient tracking,
            staff management, and equipment visibility.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-7
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <div className="mb-5 h-1.5 w-14 rounded-full bg-slate-700" />

              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                {feature.description}
              </p>

            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="operations"
        className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      >

        <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl lg:p-16">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                Emergency Coordination
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight">
                Improve hospital response efficiency with ERFlow.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Designed for emergency departments that require fast,
                reliable, and organized workflows during critical situations.
              </p>

            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">

              <a
                href="/login"
                className="rounded-2xl bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Launch Dashboard
              </a>

              <a
                href="#features"
                className="rounded-2xl border border-white/20 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
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