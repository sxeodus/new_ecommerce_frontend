import asyncHandler from '../middleware/asyncHandler.js';
import db from '../db.js'; // Use the improved, safer db module
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const isPostgres = !!process.env.DATABASE_URL;
  const result = await db.query(
    `SELECT id, username, email, "isAdmin" FROM users WHERE id = ${isPostgres ? '$1' : '?'}`,
    [req.user.id]
  );
  const users = isPostgres ? result.rows : result[0];

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
  const isPostgres = !!process.env.DATABASE_URL;
  const result = await db.query(`SELECT * FROM users WHERE id = ${isPostgres ? '$1' : '?'}`, [
    req.user.id,
  ]);
  const users = isPostgres ? result.rows : result[0];

  if (users.length > 0) {
    const user = users[0];

    const updateFields = [];
    const updateValues = [];

    // Only add fields to the update query if they were provided in the request
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateFields.push(isPostgres ? `password = $${updateValues.length + 1}` : 'password = ?');
      updateValues.push(hashedPassword);
    }
    if (req.body.username) {
      updateFields.push(isPostgres ? `username = $${updateValues.length + 1}` : 'username = ?');
      updateValues.push(req.body.username);
    }
    if (req.body.email) {
      updateFields.push(isPostgres ? `email = $${updateValues.length + 1}` : 'email = ?');
      updateValues.push(req.body.email);
    }

    if (updateFields.length > 0) {
      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ${isPostgres ? `$${updateFields.length + 1}` : '?'}`;
      await db.query(sql, [...updateValues, req.user.id]);
    }

    // Fetch the latest user profile to send back in the response
    const updatedResult = await db.query(
      `SELECT id, username, email, "isAdmin" FROM users WHERE id = ${isPostgres ? '$1' : '?'}`,
      [req.user.id]
    );
    const updatedUsers = isPostgres ? updatedResult.rows : updatedResult[0];

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
  const isPostgres = !!process.env.DATABASE_URL;
  // Select all users but exclude the password
  const result = await db.query(`SELECT id, username, email, "isAdmin", created_at FROM users`);
  const users = isPostgres ? result.rows : result[0];
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const isPostgres = !!process.env.DATABASE_URL;

  // Check if the user exists
  const result = await db.query(`SELECT * FROM users WHERE id = ${isPostgres ? '$1' : '?'}`, [userId]);
  const users = isPostgres ? result.rows : result[0];

  if (users.length > 0) {
    // Add logic here to handle related records if necessary (e.g., re-assign orders)
    // For now, we will just delete the user.
    await db.query(`DELETE FROM users WHERE id = ${isPostgres ? '$1' : '?'}`, [userId]);
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getUserProfile, updateUserProfile, getUsers };
