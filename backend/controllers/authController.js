const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Role is always 'patient' on self-registration – admin must be seeded
    const user  = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'patient',
    });
    const token = generateToken(user._id);
    res.status(201).json({ user: user.toJSON(), token });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Email already registered' });
    console.error('register error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({ user: user.toJSON(), token });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, age, bloodGroup, allergies, medicalHistory } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, age, bloodGroup, allergies, medicalHistory },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Profile update failed. Please try again.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

module.exports = { register, login, updateProfile, getMe };
