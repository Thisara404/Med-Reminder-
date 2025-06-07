// filepath: c:\Users\CHAMA COMPUTERS\Downloads\Yashini\website\Backend\src\controllers\authController.js
const User = require('../model/User');
const Caregiver = require('../model/Caregiver');
const Patient = require('../model/Patient');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create corresponding profile based on role
    if (role === 'caregiver') {
      await Caregiver.create({
        user: user._id,
        specialization: 'General Care', // Default value
        qualifications: [],
        patients: [],
        organization: '',
        position: ''
      });
    } else if (role === 'patient') {
      await Patient.create({
        user: user._id,
        dateOfBirth: new Date(), // Default value, should be provided in registration
        caregivers: [],
        medications: [],
        conditions: [],
        reminders: []
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is admin
    if (user.isAdmin) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
        isAdmin: true,
        token: generateToken(user._id)
      });
    }

    // For non-admin users, verify role matches
    if (role && user.role !== role) {
      return res.status(401).json({ message: 'Invalid role' });
    }

    // Get additional profile data based on role
    let profileData = {};
    if (user.role === 'caregiver') {
      const caregiver = await Caregiver.findOne({ user: user._id });
      if (!caregiver) {
        await Caregiver.create({
          user: user._id,
          specialization: 'General Care',
          patients: []
        });
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: false,
      token: generateToken(user._id),
      ...profileData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};