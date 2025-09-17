import asyncHandler from '../middleware/asyncHandler.js';
import db from '../db.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // 1. Get email and password from the request body.
  const { email, password } = req.body;

  const isPostgres = !!process.env.DATABASE_URL;

  // 2. Find a user in the database with the matching email.
  const result = await db.query(`SELECT * FROM users WHERE email = ${isPostgres ? '$1' : '?'}`, [
    email,
  ]);
  const users = isPostgres ? result.rows : result[0];

  // 3. Check if a user was found AND if the provided password matches the hashed password in the DB.
  if (users.length > 0 && (await bcrypt.compare(password, users[0].password))) {
    const user = users[0];
    // 4. If credentials are valid, generate a JWT and set it in an http-only cookie.
    generateToken(res, user.id);

    // 5. Send back user information (without the password).
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    // 6. If credentials are not valid, send a generic 401 Unauthorized error.
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user details from the request body.
  const { username, email, password } = req.body;

  // 2. Basic validation to ensure all fields are present.
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please provide username, email, and password');
  }

  const isPostgres = !!process.env.DATABASE_URL;

  // 3. Generate a salt and hash the password for secure storage.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // 4. Insert the new user into the database.
    const query = isPostgres
      ? 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id'
      : 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const result = await db.query(
      query,
      [username, email, hashedPassword]
    );
    const newUserId = isPostgres ? result.rows[0].id : result[0].insertId;

    // 5. Generate a token for the new user to log them in automatically.
    generateToken(res, newUserId);

    // 6. Send a 201 Created status and the new user's info.
    res.status(201).json({
      id: newUserId,
      username: username,
      email: email,
      isAdmin: 0, // Default value for a new user
    });
  } catch (error) {
    // 7. If the database insert fails because the user already exists, send a 400 Bad Request.
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') { // 23505 is PostgreSQL's duplicate key error
      res.status(400);
      throw new Error('User already exists');
    }
    // 8. For any other database errors, let the generic error handler manage it.
    throw error;
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  // 1. Clear the JWT cookie by setting its expiration date to the past.
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  // 2. Send a success message.
  res.status(200).json({ message: 'Logged out successfully' });
};

export { loginUser, registerUser, logoutUser };
