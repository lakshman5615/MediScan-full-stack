
const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { manualSearch, scanSearch, guestManualSearch, guestScanSearch, getHistory } = require("../controllers/ai.controller");
=======
const { manualSearch, scanSearch, guestManualSearch, guestScanSearch } = require("../controllers/ai.controller");
>>>>>>> testingBranch
const authMiddleware = require("../middlewares/auth.jwt");
const upload = require("../middlewares/upload.middleware");

router.post("/manual-search", authMiddleware, manualSearch);
router.post("/scan-search", authMiddleware, upload.single("image"), scanSearch);
<<<<<<< HEAD
router.get("/history", authMiddleware, getHistory);
=======
>>>>>>> testingBranch

router.post("/guest/manual-search", guestManualSearch);
router.post("/guest/scan-search", upload.single("image"), guestScanSearch);


//Frontend field name = image 

module.exports = router;
