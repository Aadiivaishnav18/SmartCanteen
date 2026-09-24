import express from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// SIGN UP (REGISTER)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
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
      department: department || 'Computer Science'
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        rollNumber: newUser.rollNumber,
        department: newUser.department,
        balance: newUser.balance
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user account: ' + err.message });
  }
});

// SIGN IN (LOGIN)
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
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rollNumber: user.rollNumber,
        department: user.department,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server authentication error: ' + err.message });
  }
});

// UPDATE USER PROFILE
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, email, avatar, rollNumber, department, phone } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to update profile.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (avatar) user.avatar = avatar;
    if (rollNumber) user.rollNumber = rollNumber;
    if (department) user.department = department;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rollNumber: user.rollNumber,
        department: user.department,
        phone: user.phone,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

// GET CURRENT USER / ME
router.get('/me', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
