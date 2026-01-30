
const router = require('express').Router();
const controller = require('../controllers/cabinet.controller');
const auth = require('../middlewares/auth.jwt'); // user authentication

router.post('/add', auth, controller.addToCabinet);
router.get('/my', auth, controller.getCabinet);
//router.put('/taken/:id', auth, controller.markMedicineTaken);

module.exports = router; 
