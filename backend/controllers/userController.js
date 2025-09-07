import asyncHandler from '../middleware/asyncHandler.js';
import db from '../db.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const [users] = await db.query(
    'SELECT id, username, email, isAdmin FROM users WHERE id = ?', // Changed from name to username
    [req.user.id]
  );

  if (users.length > 0) {
    const user = users[0];
    res.json({
      id: user.id,
      username: user.username, // Changed from name to username
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [
    req.user.id,
  ]);

  if (users.length > 0) {
    const user = users[0];

    const updateFields = [];
    const updateValues = [];

    // Only add fields to the update query if they were provided in the request
    if (req.body.username) {
      updateFields.push('username = ?');
      updateValues.push(req.body.username);
    }
    if (req.body.email) {
      updateFields.push('email = ?');
      updateValues.push(req.body.email);
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length > 0) {
      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      await db.query(sql, [...updateValues, req.user.id]);
    }

    // Fetch the latest user profile to send back in the response
    const [updatedUsers] = await db.query(
      'SELECT id, username, email, isAdmin FROM users WHERE id = ?',
      [req.user.id]
    );

    res.status(200).json(updatedUsers[0]);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Select all users but exclude the password
  const [users] = await db.query('SELECT id, username, email, isAdmin FROM users');
  res.status(200).json(users);
});

export { getUserProfile, updateUserProfile, getUsers };
