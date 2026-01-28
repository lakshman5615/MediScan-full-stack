// src/controllers/ai.controller.js
const ScanMedicine = require("../models/scanmedicine");
const AIHistory = require("../models/AIHistory");
const normalizeText = require("../utils/textnormalizer");
// const normalizeAIResponse = require("../utils/ainormalizer");

const { getMedicineExplanation } = require("../services/ai.service");

exports.manualSearch = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;

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
            userId: req.user.id,
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
        const { imageUrl } = req.body;
        const userID = req.user.id;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image url is required" })
        }
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
            imageUrl,
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
