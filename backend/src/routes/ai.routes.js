
const express = require("express");
const router = express.Router();
const { manualSearch, scanSearch } = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.jwt");
const upload = require("../middlewares/upload.middleware");

router.post("/manual-search", authMiddleware, manualSearch);
router.post("/scan-search", authMiddleware, upload.single("image"), scanSearch);
//Frontend field name = image 

module.exports = router;
