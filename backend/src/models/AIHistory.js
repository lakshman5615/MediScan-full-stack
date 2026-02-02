const mongoose = require("mongoose");

const aiHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    default: null
  },

  inputText: {
    type: String,
    required: true
  },
  normalizedQuery: {
    type: String,
    default: null // only manual
  },
  aiSnapshot: {
    medicineName: String,
    usage: String,
    dosage: String,
    warnings: String,
    sideEffects: String,
    expirydate: String

  },
  queryType:
  {
    type: String,
    enum: ["text", "scan"],
    required: true
  },
  imageUrl: {
    type: String,
    required: function () {
      return this.queryType === "scan";
    }
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    required: true

  },
  resultRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScanMedicine",
    default: null
  },

},
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AIHistory", aiHistorySchema);
