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

    //  NEW: Track quantity. Decrements on assignment, increments on release.
    inventory: {
      type: Number,
      default: 1,
      min: 0,
    },

    // assignedPatient is kept for quick lookup of which patient has this item assigned.
    // The source-of-truth for all equipment assigned to a patient is Patient.equipment array.
    assignedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

if (mongoose.models.Equipment) {
  delete mongoose.models.Equipment;
}
const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;
