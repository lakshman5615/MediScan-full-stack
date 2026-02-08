
const express = require("express");
const router = express.Router();

const { getRecentSearches } = require("../controllers/dashboard.controller");
const { getExpirySoonCount } = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.jwt");


router.get("/recent-search", authMiddleware, getRecentSearches);
router.get("/expiry-soon", authMiddleware, getExpirySoonCount);


module.exports = router;
