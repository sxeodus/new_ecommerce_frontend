import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import db from '../db.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the http-only cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const isPostgres = !!process.env.DATABASE_URL;

      const result = await db.query(
        `SELECT id, username, email, "isAdmin" FROM users WHERE id = ${isPostgres ? '$1' : '?'}`,
        [decoded.userId]
      );

      const user = isPostgres ? result.rows[0] : result[0][0];

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error('User not found for this token');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
