const express = require('express');
const router = express.Router();
const MedicineController = require('../controllers/medicine.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// My Cabinet routes
router.get('/', authMiddleware, MedicineController.getMedicines);
router.post('/add', authMiddleware, MedicineController.addMedicine);
router.post('/accept', authMiddleware, MedicineController.acceptMedicine);
router.post('/reject', authMiddleware, MedicineController.rejectMedicine);
router.get('/alerts', authMiddleware, MedicineController.getAlerts);

module.exports = router;