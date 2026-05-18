import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // Links this Doctor profile to the User account (login) that owns it.
    // Set at creation time so doctor-dashboard lookup never relies on name matching.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
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
