import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      index: true,
    },
    gender: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Waiting", "In treatment", "Completed"],
      default: "Waiting",
    },
    // department stores department name string (dynamic, from Department collection)
    department: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      default: "Low",
    },
    //  UPDATED: Now an array to support multiple doctors per patient
    doctor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    equipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
      },
    ],
  },
  { timestamps: true },
);

if (mongoose.models.Patient) {
  delete mongoose.models.Patient;
}
const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
