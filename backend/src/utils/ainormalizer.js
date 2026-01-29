function normalizeAIResponse(ai = {}) {
    return {
        medicineName:
            ai.medicine_name ||
            ai.medicinename ||
            ai.medicineName ||
            "Unknown",

        usage: ai.usage || "Not available",

        dosage: ai.dosage || "Not available",

        warnings: ai.warnings || "Not available",

        sideEffects:
            ai.sideEffects ||
            ai.side_effects ||
            "Not available",

        expirydate:
            ai.expirydate ||
            ai.expiry_date ||
            null
    };
}

module.exports = normalizeAIResponse;
