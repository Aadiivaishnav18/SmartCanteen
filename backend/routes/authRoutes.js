import express from 'express';
import { User } from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// SIGN UP (REGISTER) - POST /api/auth/signup & POST /api/auth/register
const handleRegister = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department, phone, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      rollNumber: rollNumber || 'CS2024-089',
      department: department || 'Computer Science',
      phone: phone || phoneNumber || '+91 98765 43210',
      phoneNumber: phone || phoneNumber || '+91 98765 43210'
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        rollNumber: newUser.rollNumber,
        department: newUser.department,
        phone: newUser.phone,
        phoneNumber: newUser.phoneNumber,
        balance: newUser.balance
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user account: ' + err.message });
  }
};

router.post('/signup', handleRegister);
router.post('/register', handleRegister);

// SIGN IN (LOGIN) - POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid campus email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid campus email or password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rollNumber: user.rollNumber,
        department: user.department,
        phone: user.phone,
        phoneNumber: user.phoneNumber,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server authentication error: ' + err.message });
  }
});

// LOGOUT - POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET USER PROFILE - GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE USER PROFILE - PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { userId, name, email, avatar, rollNumber, department, phone, phoneNumber } = req.body;

    const targetId = userId || req.user?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'User ID is required to update profile.' });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (avatar) user.avatar = avatar;
    if (rollNumber) user.rollNumber = rollNumber;
    if (department) user.department = department;
    if (phone || phoneNumber) {
      user.phone = phone || phoneNumber;
      user.phoneNumber = phone || phoneNumber;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rollNumber: user.rollNumber,
        department: user.department,
        phone: user.phone,
        phoneNumber: user.phoneNumber,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

// GET CURRENT USER / ME
router.get('/me', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
