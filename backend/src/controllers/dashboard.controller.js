const AIHistory = require("../models/AIHistory");
const Medicine = require("../models/Medicine");
exports.getRecentSearches = async (req, res) => {
    try {
        const userId = req.user._id;

        const history = await AIHistory.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select("queryType aiSnapshot createdAt status");

        const formatted = history.map(item => ({
            name: item.aiSnapshot?.medicineName || "Unknown",
            type: item.queryType, // scan / text
            time: item.createdAt,
            verified: item.status === "success"
        }));

        res.json({
            source: "Database",
            data: formatted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load recent searches" });
    }
};



exports.getExpirySoonCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(today.getDate() + 5);
        fiveDaysFromNow.setHours(23, 59, 59, 999);

        const count = await Medicine.countDocuments({
            userId,
            expiryDate: {
                $gte: today,
                $lte: fiveDaysFromNow
            }
        });

        res.json({
            success: true,
            expiresSoonCount: count
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch expiry data"
        });
    }
};


exports.getLowStockCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const count = await Medicine.countDocuments({
            userId,
            $expr: {
                $lte: ["$remainingQuantity", "$lowStockThreshold"]
            }
        });

        res.json({
            success: true,
            lowStockCount: count
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch low stock data"
        });
    }
};


exports.getTodaySchedule = async (req, res) => {
  try {
    const userId = req.user._id;

    const medicines = await Medicine.find({ userId })
      .select("name dosage schedule remainingQuantity");

    const todaySchedule = [];

    medicines.forEach(med => {
      Object.entries(med.schedule).forEach(([key, value]) => {
        if (value.enabled) {
          todaySchedule.push({
            medicineId: med._id,
            name: med.name,
            dosage: med.dosage,
            slot: key,               // morning / afternoon / evening / night
            time: value.time,
            remainingQuantity: med.remainingQuantity
          });
        }
      });
    });

    // time wise sort
    todaySchedule.sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    res.json({
      success: true,
      data: todaySchedule
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

