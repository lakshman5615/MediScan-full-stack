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
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed ❌", err);
    process.exit(1);
  }
};

// Seed Data
const seedData = async () => {
  try {
    // =========================
    // 1️⃣ USER 1 - Siddhika
    // =========================
    let user1 = await User.findOne({ email: "siddhika@example.com" });

    if (!user1) {
      user1 = new User({
        name: "Siddhika",
        age: 21,
        email: "siddhika@example.com",
        password: "hashedPassword123",
        phone: "9876543210"
      });
      await user1.save();
      console.log("User 1 created ✅");
    } else {
      console.log("User 1 already exists ✅");
    }

    // Medicine for User 1
    const medicine1 = new Medicine({
      userId: user1._id,
      medicineName: "Paracetamol",
      expiryDate: new Date("2026-05-10"),
      quantity: 10,
      schedule: "Morning, Night",
      aiExplanation: {
        usage: "Take after food",
        dosage: "500mg",
        warnings: "Do not exceed 4 tablets/day",
        sideEffects: "May cause dizziness"
      },
      missedCount: 0
    });
    await medicine1.save();
    console.log("User 1 Medicine created ✅");

    // MissedMedicine for User 1
    const missed1 = new MissedMedicine({
      userId: user1._id,
      medicineId: medicine1._id,
      date: new Date(),
      reason: "no-response" // ✅ valid enum
    });
    await missed1.save();
    console.log("User 1 MissedMedicine created ✅");

    // AIHistory for User 1
    const aiHistory1 = new AIHistory({
      userId: user1._id,
      medicineName: medicine1.medicineName,
      question: "Can I take it daily?",
      aiResponse: "Yes, but do not exceed 4 tablets/day"
    });
    await aiHistory1.save();
    console.log("User 1 AIHistory created ✅");

    // =========================
    // 2️⃣ USER 2 - Rahul
    // =========================
    let user2 = await User.findOne({ email: "rahul@example.com" });

    if (!user2) {
      user2 = new User({
        name: "Rahul Sharma",
        age: 25,
        email: "rahul@example.com",
        password: "hashedPassword456",
        phone: "9123456780"
      });
      await user2.save();
      console.log("User 2 created ✅");
    } else {
      console.log("User 2 already exists ✅");
    }

    // Medicine for User 2
    const medicine2 = new Medicine({
      userId: user2._id,
      medicineName: "Cetirizine",
      expiryDate: new Date("2026-08-15"),
      quantity: 20,
      schedule: "Night",
      aiExplanation: {
        usage: "Take before sleep",
        dosage: "10mg",
        warnings: "May cause drowsiness",
        sideEffects: "Sleepiness"
      },
      missedCount: 1
    });
    await medicine2.save();
    console.log("User 2 Medicine created ✅");

    // MissedMedicine for User 2
    const missed2 = new MissedMedicine({
      userId: user2._id,
      medicineId: medicine2._id,
      date: new Date(),
      reason: "reject" // ✅ valid enum
    });
    await missed2.save();
    console.log("User 2 MissedMedicine created ✅");

    // AIHistory for User 2
    const aiHistory2 = new AIHistory({
      userId: user2._id,
      medicineName: medicine2.medicineName,
      question: "Is it safe to take daily?",
      aiResponse: "Yes, but avoid driving after taking this medicine"
    });
    await aiHistory2.save();
    console.log("User 2 AIHistory created ✅");

    console.log("🎉 ALL SAMPLE DATA INSERTED SUCCESSFULLY");
    process.exit(0);

  } catch (err) {
    console.error("Seed data failed ❌", err);
    process.exit(1);
  }
};

// Run Seeder
connectDB().then(seedData);
