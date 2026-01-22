class AIService {
  // Generate medicine explanation using AI
  async generateExplanation(medicineName) {
    try {
      // Mock AI response for now
      return {
        usage: `${medicineName} is used for treating various conditions. Please consult your doctor for proper usage.`,
        dosage: "Take as prescribed by your doctor.",
        warnings: "Keep out of reach of children. Store in a cool, dry place."
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        usage: "Please consult your doctor for usage instructions.",
        dosage: "Follow doctor's prescription.",
        warnings: "Keep medicines safe and away from children."
      };
    }
  }
}

module.exports = new AIService();