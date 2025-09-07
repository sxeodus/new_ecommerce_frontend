import express from 'express';
const router = express.Router();
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', logoutUser);

export default router;
