const mongoose = require("mongoose");

const scanmedicineSchema = new mongoose.Schema({

    medicineName: {
        type: String,
        required: true,
        trim: true
    },

    normalizedName: {
        type: String,
        index: true

    },

    expiryDate: {
        type: Date,
        default: null
    },


    aiExplanation: {
        medicinename: String,
        usage: String,
        dosage: String,
        warnings: String,
        sideEffects: String,
        expirydate: String

    },
    source: {
        type: String,
        enum: ["scan", "text"],
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ScanMedicine", scanmedicineSchema);
