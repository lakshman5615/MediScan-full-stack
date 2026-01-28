const router = require('express').Router();
const { markDose, getDoseHistory } = require('../controllers/dose.controller');
const auth = require('../middlewares/auth.jwt');

router.post('/mark', auth, markDose);
router.get('/history', auth, getDoseHistory);

module.exports = router;
