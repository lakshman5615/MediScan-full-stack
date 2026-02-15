
const express = require("express");
const router = express.Router();

const { getRecentSearches } = require("../controllers/dashboard.controller");
<<<<<<< HEAD
const { getExpirySoonCount } = require("../controllers/dashboard.controller");
const { getLowStockCount } = require("../controllers/dashboard.controller");
const {getTodaySchedule} = require("../controllers/dashboard.controller")

=======
>>>>>>> testingBranch
const authMiddleware = require("../middlewares/auth.jwt");


router.get("/recent-search", authMiddleware, getRecentSearches);
<<<<<<< HEAD
router.get("/expiry-soon", authMiddleware, getExpirySoonCount);
router.get("/low-stock", authMiddleware, getLowStockCount);
router.get("/today-schedule",authMiddleware,getTodaySchedule);
=======
>>>>>>> testingBranch


module.exports = router;
