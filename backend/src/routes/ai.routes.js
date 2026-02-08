
const express = require("express");
const router = express.Router();
const { manualSearch, scanSearch, guestManualSearch, guestScanSearch, getHistory } = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.jwt");
const upload = require("../middlewares/upload.middleware");

router.post("/manual-search", authMiddleware, manualSearch);
router.post("/scan-search", authMiddleware, upload.single("image"), scanSearch);
router.get("/history", authMiddleware, getHistory);

router.post("/guest/manual-search", guestManualSearch);
router.post("/guest/scan-search", upload.single("image"), guestScanSearch);


//Frontend field name = image 

module.exports = router;
