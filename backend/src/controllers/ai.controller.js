// src/controllers/ai.controller.js
const ScanMedicine = require("../models/scanmedicine");
const AIHistory = require("../models/AIHistory");
const normalizeText = require("../utils/textnormalizer");
// const normalizeAIResponse = require("../utils/ainormalizer");

const { getMedicineExplanation } = require("../services/ai.service");

exports.manualSearch = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;
        const text = name;

        const normalized = normalizeText(text);

        let scanMed = await ScanMedicine.findOne({
            normalizedName: normalized
        });

        //  DB HIT
        if (scanMed) {
            const historyEntry = await AIHistory.create({
                userId,
                inputText: text,
                normalizedQuery: normalized,
                queryType: "text",
                status: "success",
                resultRef: scanMed._id,
                aiSnapshot: scanMed.aiExplanation
            });


            return res.json({
                source: "database",
                data: scanMed
            });
        }

        // GROQ AI CALL
        const aiData = await getMedicineExplanation(text, null)

        const aiSnapshot = JSON.parse(JSON.stringify(aiData));  //deep copy

        scanMed = await ScanMedicine.create({
            medicineName: text,
            normalizedName: normalized,
            aiExplanation: aiData,
            source: "text"
        });

        const historyEntry2 = await AIHistory.create({
            userId,
            inputText: text,
            normalizedQuery: normalized,
            queryType: "text",
            status: "success",
            resultRef: scanMed._id,
            aiSnapshot
        });


        return res.json({
            source: "groq",
            data: scanMed
        });

    } catch (error) {
        console.error(error);

        await AIHistory.create({
            userId: req.user._id,
            inputText: req.body.text,
            queryType: "text",
            status: "failed"
        });

        res.status(500).json({ message: "Internal Server Error" });
    }

};

//SCAN IMAGE SEARCH FUNCTION
exports.scanSearch = async (req, res) => {
    try {

        const userID = req.user.id;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ message: "Image file is required" })
        }
        //base64
        // const base64Image = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
        const imageBase64 = image.buffer.toString("base64");
        const imageUrl = `data:${image.mimetype};base64,${imageBase64}`;

        // CALL GROQ AI 
        const aiData = await getMedicineExplanation("analyze this medicnie image ", imageUrl);
        const aiSnapshot = JSON.parse(JSON.stringify(aiData));

        const normalized = normalizeText(aiData.medicineName || "not found ");
        // CEHCK DB 
        let scanMed = await ScanMedicine.findOne({
            normalizedName: normalized
        });
        if (!scanMed) {
            scanMed = await ScanMedicine.create({
                medicineName: aiData.medicineName || "not found",
                normalizedName: normalized,
                aiExplanation: aiData,
                source: "scan"
            });
        }
        await AIHistory.create({
            userId: userID,
            inputText: "IMAGE-SCAN",
            normalizedQuery: normalized,
            queryType: "scan",
            status: "success",
            resultRef: scanMed._id,
            imageUrl: "uploaded-via-multer",
            aiSnapshot
        });
        return res.json({
            source: "AI ",
            data: aiData
        });


    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Scan failed" });

    }
};
exports.guestManualSearch = async (req, res) => {
    try {
        const { text } = req.body;

        const normalized = normalizeText(text);


        const scanMed = await ScanMedicine.findOne({
            normalizedName: normalized
        });

        if (scanMed) {
            return res.json({
                source: "database",
                data: scanMed.aiExplanation
            });
        }
        const aiData = await getMedicineExplanation(text, null);

        return res.json({
            source: "ai",
            data: aiData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GUEST SCAN IMAGE SEARCH
exports.guestScanSearch = async (req, res) => {
    try {
        const image = req.file;

        if (!image) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // image → base64 data URL
        const imageBase64 = image.buffer.toString("base64");
        const imageUrl = `data:${image.mimetype};base64,${imageBase64}`;

        // AI CALL
        const aiData = await getMedicineExplanation(
            "analyze this medicine image",
            imageUrl
        );

        return res.json({
            source: "ai",
            data: aiData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Scan failed" });
    }
};
