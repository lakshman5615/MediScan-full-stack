const router = require('express').Router();
const controller = require('./cabinet.controller');
const auth = require('../middlewares/auth'); // user authentication

router.post('/add', auth, controller.addMedicine);
router.get('/my', auth, controller.getCabinet);
router.put('/taken/:id', auth, controller.markMedicineTaken);

module.exports = router;
