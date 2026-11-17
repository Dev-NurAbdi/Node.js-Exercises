const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

exports.profilePicture = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please attach an image using the field name "image".' });
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'personal-finance/profile-pictures', resource_type: 'image' },
        (error, uploaded) => error ? reject(error) : resolve(uploaded)
      );
      stream.end(req.file.buffer);
    });
    const user = await User.findByIdAndUpdate(req.user._id, { profilePicture: result.secure_url }, { new: true });
    res.json({ message: 'Profile picture uploaded.', profilePicture: user.profilePicture });
  } catch (error) { next(error); }
};
