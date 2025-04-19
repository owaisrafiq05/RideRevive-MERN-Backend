import express from 'express';
import { signupController, loginController, otpVerificationController } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/verify-otp', otpVerificationController);

export default router;
