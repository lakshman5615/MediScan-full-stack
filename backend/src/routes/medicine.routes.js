const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.jwt');
const medicineController = require('../controllers/medicine.controller');

// Core Medicine Cabinet APIs
router.post('/add', authMiddleware, medicineController.addMedicine);
router.get('/', authMiddleware, medicineController.getMedicines);
router.get('/:id', authMiddleware, medicineController.getMedicine);
router.put('/update/:id', authMiddleware, medicineController.updateMedicine);
router.delete('/delete/:id', authMiddleware, medicineController.deleteMedicine);

// Dose Actions
router.post('/taken/:id', authMiddleware, medicineController.markTaken);
router.post('/missed/:id', authMiddleware, medicineController.markMissed);

module.exports = router;