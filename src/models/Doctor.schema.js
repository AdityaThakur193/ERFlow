import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    // ⭐ NEW: Which department this doctor belongs to
    department: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["busy", "Available", "On Break"],
      default: "Available",
    },
    roomNumber: {
      type: String,
      required: true,
    },
    // ⭐ NEW: Tracks all active patients this doctor is treating
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timestamps: true },
);

if (mongoose.models.Doctor) {
  delete mongoose.models.Doctor;
}
const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
