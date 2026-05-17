/**
 * ERFlow - Database Seed Script
 * ==============================
 * Run with:  npm run seed
 *
 * Make sure your MONGO_URI is set in .env before running.
 * This script will CLEAR existing data and reload fresh mock data each run.
 */

// Node v20.6+ --env-file flag loads .env automatically
// For older Node, uncomment: require("dotenv").config();

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found. Make sure .env is set up.");
  process.exit(1);
}

// ─── SCHEMAS ────────────────────────────────────────────────────────────────

const Department = mongoose.model("Department", new mongoose.Schema(
  { name: { type: String, required: true, unique: true }, description: String },
  { timestamps: true }
));

const Doctor = mongoose.model("Doctor", new mongoose.Schema(
  {
    name: String, specialization: String, department: String,
    status: { type: String, enum: ["Available", "busy", "On Break"], default: "Available" },
    roomNumber: String,
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  },
  { timestamps: true }
));

const Patient = mongoose.model("Patient", new mongoose.Schema(
  {
    name: String, age: Number, gender: String, symptoms: String,
    status: { type: String, enum: ["Waiting", "In treatment", "Completed"], default: "Waiting" },
    department: String,
    priority: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Low" },
    doctor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
  },
  { timestamps: true }
));

const Equipment = mongoose.model("Equipment", new mongoose.Schema(
  {
    name: String, category: String,
    status: { type: String, enum: ["Available", "In Use", "Maintenance"], default: "Available" },
    roomNumber: String,
    inventory: { type: Number, default: 1 },
    assignedPatient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
  },
  { timestamps: true }
));

const User = mongoose.model("users", new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    position: { type: String, enum: ["Admin", "Doctor", "Receptionist"], required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
));

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { name: "Emergency", description: "Primary emergency triage and stabilization" },
  { name: "ICU", description: "Intensive care for critical and post-operative patients" },
  { name: "Trauma", description: "Trauma surgery and acute injury management" },
  { name: "Cardiology", description: "Heart and cardiovascular system care" },
  { name: "Neurology", description: "Brain, spine and nervous system treatment" },
  { name: "Pediatrics", description: "Emergency care for patients under 18" },
];

const DOCTORS_RAW = [
  { name: "Sarah Mitchell", specialization: "Emergency Medicine", department: "Emergency", roomNumber: "ER-101", status: "Available" },
  { name: "James Chen", specialization: "Trauma Surgery", department: "Trauma", roomNumber: "TR-201", status: "Available" },
  { name: "Priya Sharma", specialization: "Cardiology", department: "Cardiology", roomNumber: "CU-301", status: "Available" },
  { name: "Omar Hassan", specialization: "Neurology", department: "Neurology", roomNumber: "NR-401", status: "Available" },
  { name: "Elena Vasquez", specialization: "Anesthesiology", department: "ICU", roomNumber: "ICU-501", status: "Available" },
  { name: "David Park", specialization: "Pediatrics", department: "Pediatrics", roomNumber: "PD-601", status: "On Break" },
  { name: "Rachel Adams", specialization: "Emergency Medicine", department: "Emergency", roomNumber: "ER-102", status: "Available" },
  { name: "Ali Rahman", specialization: "General Surgery", department: "Trauma", roomNumber: "TR-202", status: "Available" },
];

const PATIENTS_RAW = [
  { name: "Marcus Johnson", age: 45, gender: "Male", symptoms: "Severe chest pain radiating to left arm, shortness of breath, diaphoresis. Onset 30 minutes ago.", priority: "Critical", department: "Cardiology", status: "In treatment" },
  { name: "Aisha Patel", age: 8, gender: "Female", symptoms: "High fever (103°F), difficulty breathing, rash spreading across torso. Parents report no known allergies.", priority: "Critical", department: "Pediatrics", status: "Waiting" },
  { name: "Robert Nguyen", age: 67, gender: "Male", symptoms: "Sudden loss of speech, right-sided facial droop, arm weakness. Last known well 45 minutes ago.", priority: "Critical", department: "Neurology", status: "In treatment" },
  { name: "Clara Fernandez", age: 32, gender: "Female", symptoms: "MVA victim. Multiple lacerations, suspected rib fractures, decreased breath sounds on left side.", priority: "High", department: "Trauma", status: "In treatment" },
  { name: "Henry Walsh", age: 58, gender: "Male", symptoms: "Diabetic ketoacidosis. Blood glucose >400, vomiting for 12 hours, altered mental status.", priority: "High", department: "Emergency", status: "Waiting" },
  { name: "Sophia Kim", age: 24, gender: "Female", symptoms: "Suspected overdose. Unresponsive, pinpoint pupils, slow shallow breathing.", priority: "High", department: "Emergency", status: "In treatment" },
  { name: "George Thompson", age: 71, gender: "Male", symptoms: "Fall from height. Hip pain, unable to bear weight, confused and disoriented.", priority: "Medium", department: "Trauma", status: "Waiting" },
  { name: "Lily Chen", age: 5, gender: "Female", symptoms: "Febrile seizure, now post-ictal. First seizure, no prior history.", priority: "Medium", department: "Pediatrics", status: "Waiting" },
  { name: "David Okafor", age: 39, gender: "Male", symptoms: "Severe allergic reaction to bee sting. Urticaria, mild throat tightness. Epinephrine given on scene.", priority: "Medium", department: "Emergency", status: "Waiting" },
  { name: "Nancy Rivera", age: 53, gender: "Female", symptoms: "Kidney stone confirmed on CT. Pain 9/10, nausea, unable to tolerate oral fluids.", priority: "Low", department: "Emergency", status: "Waiting" },
  { name: "Tom Bradley", age: 28, gender: "Male", symptoms: "Laceration to right hand from industrial equipment. Deep, 5 cm wound, tendon possibly involved.", priority: "Low", department: "Trauma", status: "Completed" },
];

const EQUIPMENT_RAW = [
  { name: "GE CARESCAPE R860 Ventilator", category: "Ventilator", roomNumber: "ER-101", status: "Available", inventory: 6 },
  { name: "Philips IntelliVue MX800 Monitor", category: "Monitor", roomNumber: "ICU-501", status: "Available", inventory: 10 },
  { name: "Zoll R Series Defibrillator", category: "Defibrillator", roomNumber: "ER-102", status: "Available", inventory: 4 },
  { name: "Baxter Sigma Spectrum Infusion Pump", category: "Infusion Pump", roomNumber: "TR-201", status: "Available", inventory: 8 },
  { name: "Welch Allyn Connex ECG", category: "ECG", roomNumber: "CU-301", status: "Available", inventory: 3 },
  { name: "Drive Medical Bariatric Wheelchair", category: "Wheelchair", roomNumber: "ER-101", status: "Available", inventory: 12 },
  { name: "Invacare HomeFill Oxygen Cylinder", category: "Oxygen Cylinder", roomNumber: "TR-202", status: "Available", inventory: 20 },
  { name: "Medela Dominant Flex Suction Unit", category: "Suction Unit", roomNumber: "NR-401", status: "Available", inventory: 2 },
  { name: "Alaris MedSystem IV Pump", category: "IV Pump", roomNumber: "ICU-501", status: "Available", inventory: 15 },
  { name: "Ferno 35-A Stretcher", category: "Stretcher", roomNumber: "ER-101", status: "Available", inventory: 7 },
  { name: "Mindray BeneVision N22 Monitor", category: "Monitor", roomNumber: "CU-301", status: "Maintenance", inventory: 1 },
  { name: "Hamilton C6 Ventilator", category: "Ventilator", roomNumber: "ICU-501", status: "Available", inventory: 3 },
];

const USERS_RAW = [
  { username: "Admin User", email: "admin@example.com", position: "Admin", isAdmin: true },
  { username: "Dr. Sarah Mitchell", email: "doctor@example.com", position: "Doctor", isAdmin: false },
  { username: "Front Desk", email: "receptionist@example.com", position: "Receptionist", isAdmin: false },
];

// ─── SEED ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("\n🌱 ERFlow Seed Script Starting...\n");

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear all collections
  await Promise.all([
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
    Equipment.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data\n");

  // 1. Departments
  const depts = await Department.insertMany(DEPARTMENTS);
  console.log(`✅ Created ${depts.length} departments`);

  // 2. Doctors
  const doctors = await Doctor.insertMany(DOCTORS_RAW);
  console.log(`✅ Created ${doctors.length} doctors`);

  // 3. Patients
  const patients = await Patient.insertMany(PATIENTS_RAW);
  console.log(`✅ Created ${patients.length} patients`);

  // 4. Equipment
  const equipment = await Equipment.insertMany(EQUIPMENT_RAW);
  console.log(`✅ Created ${equipment.length} equipment items`);

  // 5. Users
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash("password123", salt);
  const usersWithPasswords = USERS_RAW.map(u => ({ ...u, password: hashedPassword }));
  const users = await User.insertMany(usersWithPasswords);
  console.log(`✅ Created ${users.length} users\n`);

  // 5. Wire up relationships
  const find = (arr, name) => arr.find((x) => x.name === name);

  const marcus = find(patients, "Marcus Johnson");
  const robert = find(patients, "Robert Nguyen");
  const clara = find(patients, "Clara Fernandez");
  const sophia = find(patients, "Sophia Kim");

  const priya = find(doctors, "Priya Sharma");
  const omar = find(doctors, "Omar Hassan");
  const james = find(doctors, "James Chen");
  const ali = find(doctors, "Ali Rahman");
  const sarah = find(doctors, "Sarah Mitchell");

  const ventilator = find(equipment, "GE CARESCAPE R860 Ventilator");
  const monitor = find(equipment, "Philips IntelliVue MX800 Monitor");

  // Marcus ← Dr. Priya + Ventilator
  await Patient.findByIdAndUpdate(marcus._id, { $push: { doctor: priya._id, equipment: ventilator._id } });
  await Doctor.findByIdAndUpdate(priya._id, { $push: { patients: marcus._id }, $set: { status: "busy" } });
  await Equipment.findByIdAndUpdate(ventilator._id, { $inc: { inventory: -1 }, assignedPatient: marcus._id, status: "In Use" });

  // Robert ← Dr. Omar + Monitor
  await Patient.findByIdAndUpdate(robert._id, { $push: { doctor: omar._id, equipment: monitor._id } });
  await Doctor.findByIdAndUpdate(omar._id, { $push: { patients: robert._id }, $set: { status: "busy" } });
  await Equipment.findByIdAndUpdate(monitor._id, { $inc: { inventory: -1 }, assignedPatient: robert._id, status: "In Use" });

  // Clara ← Dr. James + Dr. Ali (two doctors!)
  await Patient.findByIdAndUpdate(clara._id, { $push: { doctor: { $each: [james._id, ali._id] } } });
  await Doctor.findByIdAndUpdate(james._id, { $push: { patients: clara._id }, $set: { status: "busy" } });
  await Doctor.findByIdAndUpdate(ali._id, { $push: { patients: clara._id }, $set: { status: "busy" } });

  // Sophia ← Dr. Sarah
  await Patient.findByIdAndUpdate(sophia._id, { $push: { doctor: sarah._id } });
  await Doctor.findByIdAndUpdate(sarah._id, { $push: { patients: sophia._id }, $set: { status: "busy" } });

  console.log("✅ Relationships wired:");
  console.log("   • Marcus Johnson  (Cardiology Critical) ← Dr. Priya Sharma + Ventilator");
  console.log("   • Robert Nguyen   (Neurology Critical)  ← Dr. Omar Hassan + Monitor");
  console.log("   • Clara Fernandez (Trauma High)         ← Dr. James Chen + Dr. Ali Rahman");
  console.log("   • Sophia Kim      (Emergency High)      ← Dr. Sarah Mitchell");
  
  console.log("\n🔑 Test Accounts (Password for all: password123):");
  console.log("   • Admin:        admin@example.com");
  console.log("   • Doctor:       doctor@example.com");
  console.log("   • Receptionist: receptionist@example.com");

  console.log("\n🎉 Seed complete! Visit http://localhost:3000 to test.\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
