const AIHistory = require("../models/AIHistory");
exports.getRecentSearches = async (req, res) => {
    try {
        const userId = req.user.id;

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
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: "Failed to load recent searches" });
    }
};
