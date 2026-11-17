const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const controller = require('../controllers/uploadController');

router.post('/profile-picture', protect, upload.single('image'), controller.profilePicture);
module.exports = router;
