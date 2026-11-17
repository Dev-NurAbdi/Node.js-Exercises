const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function makeToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email is already registered.' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      message: 'Account created successfully.',
      token: makeToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture }
    });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    res.json({
      message: 'Login successful.', token: makeToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture }
    });
  } catch (error) { next(error); }
};

exports.profile = async (req, res) => {
  res.json({ user: {
    id: req.user._id, name: req.user.name, email: req.user.email,
    role: req.user.role, profilePicture: req.user.profilePicture,
    createdAt: req.user.createdAt
  } });
};
