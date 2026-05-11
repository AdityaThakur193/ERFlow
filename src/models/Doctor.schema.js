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
    status: {
      type: String,
      enum: ["busy", "Available"],
      default: "Available",
    },
    roomNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;
