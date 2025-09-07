import express from 'express';
const router = express.Router();
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// @desc    Get user profile & update user profile
// @route   GET /api/users/profile
// @route   PUT /api/users/profile
// @access  Private
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
