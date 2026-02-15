
// const router = require('express').Router();
// const controller = require('../controllers/cabinet.controller');
// const auth = require('../middlewares/auth.jwt'); // user authentication

// router.post('/add', auth, controller.addMedicine);
// router.get('/', auth, controller.getCabinet);
// //router.put('/taken/:id', auth, controller.markMedicineTaken);
// //router.get('/:id', auth, controller.getMedicineById);

// module.exports = router; 
const router = require('express').Router();
const controller = require('../controllers/cabinet.controller');
const auth = require('../middlewares/auth.jwt');

// Medicine Cabinet APIs
router.post('/add', auth, controller.addMedicine);        // Add medicine
router.get('/', auth, controller.getCabinet);            // List all medicines
router.get('/:id', auth, controller.getMedicineById);    // Single medicine details
router.put('/:id', auth, controller.updateMedicine);     // Edit medicine
router.delete('/:id', auth, controller.deleteMedicine);  // Delete medicine

module.exports = router;
