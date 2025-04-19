import User from '../models/userModel.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { EmailVerificationHtml } from '../templates/template.js';
import OtpModel from '../models/OTPModel.js';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "test";

const signupSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
});

// Function to hash password using crypto
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
};

// Function to verify password
const verifyPassword = (password, hash, salt) => {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
};

// Signup Controller
export const signupController = async (request, response) => {
    try {
        const parsedBody = signupSchema.safeParse(request.body);

        if (!parsedBody.success) {
            return response.status(400).json({
                message: "Validation error",
                status: false,
                errors: parsedBody.error.errors,
            });
        }

        const { name, email, password, phone } = parsedBody.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({
                message: "Email address already in use!",
                status: false
            });
        }

        // Hash the password using crypto
        const { hash, salt } = hashPassword(password);
        
        // Create user with hashed password and salt
        const user = await User.create({ 
            name, 
            email, 
            password: hash, 
            salt: salt, // Store the salt
            phone 
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification",
            html: EmailVerificationHtml(otp),
        });

        await OtpModel.create({ otp, email });

        console.log(user);

        response.status(201).json({
            data: user,
            message: "Successfully signed up! OTP sent to email.",
            status: true
        });
    } catch (error) {
        response.status(500).json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};

// Login Controller
export const loginController = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Required fields are missing!",
                status: false
            });
        }

        // Include both password and salt in the query
        const user = await User.findOne({ email }).select('+password +salt');

        if (!user) {
            return response.status(401).json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
        }

        console.log(user);

        // Verify the password using crypto
        const isValidPassword = verifyPassword(password, user.password, user.salt);

        if (!isValidPassword) {
            return response.status(401).json({
                message: "Email or Password not valid!",
                status: false,
                data: [],
            });
        }

        const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET);

        // Don't include password and salt in the response
        user.password = undefined;
        user.salt = undefined;

        response.status(200).json({
            message: "User login successful!",
            status: true,
            data: user,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        response.status(500).json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};

// OTP Verification Controller
export const otpVerificationController = async (request, response) => {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Required fields are missing!",
                status: false
            });
        }

        const otpRes = await OtpModel.findOne({ email, otp });
        if (!otpRes) {
            return response.status(400).json({
                message: "Invalid OTP!",
                status: false
            });
        }

        await OtpModel.findOneAndUpdate({ _id: otpRes._id }, { isUsed: true });
        response.status(200).json({
            message: "OTP verified!",
            status: true,
            data: []
        });
    } catch (error) {
        response.status(500).json({
            message: error.message,
            status: false,
            data: [],
        });
    }
};
