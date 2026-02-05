
const express = require("express");
const router = express.Router();

const { getRecentSearches } = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.jwt");


router.get("/recent-search", authMiddleware, getRecentSearches);


module.exports = router;
