import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "In Use", "Maintenance"],
      default: "Available",
    },

    roomNumber: {
      type: String,
      required: true,
    },

    assignedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  {
    timestamps: true,
  },
);

const Equipment = mongoose.models.Equipment || mongoose.model("Equipment",equipmentSchema)
export default Equipment
