
const express = require("express");
const router = express.Router();
const { manualSearch, scanSearch } = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.jwt");

router.post("/manual-search", authMiddleware, manualSearch);
router.post("/scan-search", authMiddleware, scanSearch);



module.exports = router;
