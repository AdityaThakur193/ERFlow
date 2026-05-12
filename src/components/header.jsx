"use client";
import AddPatientModal from "@/components/patients/AddPatientModal";
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal";
import AddDoctorModal from "@/components/doctors/AddDoctorModal"; // ADD THIS

export default function Header(props) {
  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        {/* Top Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold text-black">
            Emergency Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Monitor patients, doctors, and emergency equipment
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <AddPatientModal />
          <AddDoctorModal /> {/* ADD THIS */}
          <AddEquipmentModal />
          
          {/* ER Status */}
          <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-zinc-700 whitespace-nowrap">
              ER Stable
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}