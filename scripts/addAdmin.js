import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

// Function to hash password using crypto - same as in userController.js
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

// Admin credentials
const adminData = {
  name: 'Admin User',
  email: 'hero2911321@gmail.com',
  password: '12345678',
  phone: '+1234567890', // You can change this if needed
  role: 'admin'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log('Admin with this email already exists!');
        process.exit(0);
      }
      
      // Hash the password
      const { hash, salt } = hashPassword(adminData.password);
      
      // Create the admin user
      const admin = await User.create({
        name: adminData.name,
        email: adminData.email,
        password: hash,
        salt: salt,
        phone: adminData.phone,
        role: adminData.role,
        isVerified: true
      });
      
      console.log('Admin created successfully:');
      console.log({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        id: admin._id
      });
      
    } catch (error) {
      console.error('Error creating admin:', error);
    } finally {
      mongoose.disconnect();
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 