const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phone: String,
    conditions: [String],
    caregivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Caregiver",
      },
    ],
    medications: [
      {
        medication: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medication",
        },
        dosage: String,
        frequency: String,
        time: String,
        startDate: Date,
        endDate: Date,
        status: {
          type: String,
          enum: ["active", "completed", "discontinued"],
          default: "active",
        },
      },
    ],
    status: {
      type: String,
      enum: ["stable", "attention", "critical"],
      default: "stable",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
