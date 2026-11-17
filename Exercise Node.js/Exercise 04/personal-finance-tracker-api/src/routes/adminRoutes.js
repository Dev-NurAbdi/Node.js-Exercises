const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const controller = require('../controllers/adminController');

router.get('/overview', protect, adminOnly, controller.overview);
module.exports = router;
