const router = require('express').Router();
const controller = require('./cabinet.controller');
const auth = require('../middlewares/auth.jwt'); // user authentication

router.post('/add', auth, controller.addMedicine);
router.get('/my', auth, controller.getCabinet);

module.exports = router;
