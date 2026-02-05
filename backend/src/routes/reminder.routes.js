const router = require('express').Router();
const controller = require('../controllers/reminder.controller');
const auth = require('../middlewares/auth.jwt');

router.get('/', auth, controller.getReminders);

module.exports = router;
