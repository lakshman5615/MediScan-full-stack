// seed.js
const mongoose = require("mongoose");
require("dotenv").config();

// Models
const User = require("./src/models/User");
const Medicine = require("./src/models/Medicine");
const MissedMedicine = require("./src/models/MissedMedicine");
const AIHistory = require("./src/models/AIHistory");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // latest driver options not needed
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed ❌", err);
    process.exit(1);
  }
};

// Seed Data
const seedData = async () => {
  try {
    // 1️⃣ Check if user already exists (avoid duplicates)
    let user = await User.findOne({ email: "siddhika@example.com" });
    if (!user) {
      user = new User({
        name: "Siddhika",
        email: "siddhika@example.com",
        password: "hashedPassword123",
        phone: "9876543210"
      });
      await user.save();
      console.log("User created ✅");
    } else {
      console.log("User already exists, skipping creation ✅");
    }

    // 2️⃣ Medicine
    const medicine = new Medicine({
      userId: user._id,
      medicineName: "Paracetamol",
      expiryDate: new Date("2026-05-10"),
      quantity: 10,
      schedule: "Morning, Night", // string format
      aiExplanation: {
        usage: "Take after food",
        dosage: "500mg",
        warnings: "Do not exceed 4 tablets/day",
        sideEffects: "May cause dizziness"
      },
      missedCount: 0
    });
    await medicine.save();
    console.log("Medicine created ✅");

    // 3️⃣ MissedMedicine
  const missed = new MissedMedicine({
  userId: user._id,
  medicineId: medicine._id,
  date: new Date(),
  // reason optional, default "reject" lag jayega
});
await missed.save();

    await missed.save();
    console.log("MissedMedicine created ✅");

    // 4️⃣ AIHistory
    const aiHistory = new AIHistory({
      userId: user._id,
      medicineName: medicine.medicineName,
      question: "Can I take it daily?",
      aiResponse: "Yes, but do not exceed 4 tablets/day"
    });
    await aiHistory.save();
    console.log("AIHistory created ✅");

    console.log("✅ Sample data inserted successfully");
    process.exit(0);

  } catch (err) {
    console.error("Seed data failed ❌", err);
    process.exit(1);
  }
};

// Run
connectDB().then(seedData);
