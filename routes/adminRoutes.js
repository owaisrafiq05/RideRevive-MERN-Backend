import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "test";

const router = express.Router();

// Function to verify password - same as in userController.js
const verifyPassword = (password, hash, salt) => {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Required fields are missing!",
        status: false
      });
    }

    // Find the user and include password and salt
    const admin = await User.findOne({ 
      email, 
      role: 'admin' // Ensure the user has admin role
    }).select('+password +salt');

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin credentials",
        status: false,
        data: [],
      });
    }

    // Verify the password
    const isValidPassword = verifyPassword(password, admin.password, admin.salt);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid admin credentials",
        status: false,
        data: [],
      });
    }

    // Create JWT token
    const token = jwt.sign({ 
      _id: admin._id, 
      email: admin.email,
      role: admin.role
    }, JWT_SECRET);

    // Remove sensitive data
    admin.password = undefined;
    admin.salt = undefined;

    // Send response
    res.status(200).json({
      message: "Admin login successful!",
      status: true,
      data: admin,
      token
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      message: error.message,
      status: false,
      data: [],
    });
  }
});

export default router; 