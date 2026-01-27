export async function scanMedicineByImage(file) {
  // 🔴 abhi dummy data
  return {
    name: "Amoxicillin",
    usage: "Twice daily after meals",
    dosage: "500mg",
  };
}

export async function scanMedicineByName(name) {
  return {
    name,
    usage: "Once daily",
    sideEffects: "Nausea, headache",
  };
}
