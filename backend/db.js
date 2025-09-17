import mysql from 'mysql2/promise';
import pg from 'pg';
import dotenv from 'dotenv';
import colors from 'colors';

// This will load the variables from the .env file
dotenv.config();

let pool;
let dbType = 'mysql'; // Default to mysql

// Self-executing async function to create and check the pool on startup
(async () => {
  // Check if DATABASE_URL is provided (for services like Render)
  if (process.env.DATABASE_URL) {
    try {
      pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Required for Render's free tier
        },
      });
      dbType = 'postgres';
      await pool.query('SELECT NOW()'); // Test connection
      console.log('PostgreSQL Database connected successfully'.blue.underline);
    } catch (error) {
      console.error(`FATAL: PostgreSQL connection failed.`.red.bold.underline);
      console.error(`Error: ${error.message}`.red);
      process.exit(1);
    }
  } else {
    // Fallback to MySQL for local development
    try {
      const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      connection.release();
      console.log('MySQL Database connected successfully'.cyan.underline);
    } catch (error) {
      console.error(`FATAL: MySQL connection failed.`.red.bold.underline);
      console.error(`Error: ${error.message}`.red);
      console.error(
        'Please ensure the database is running and .env credentials are correct.'
          .yellow
      );
      process.exit(1);
    }
  }
})();

// Export the pool for use in controllers
export default {
  get query() {
    if (!pool) {
      console.error('FATAL: Database pool is not available. Exiting.'.red.bold);
      process.exit(1);
    }
    return pool.query.bind(pool);
  },
  get getConnection() {
    if (!pool) {
      console.error('FATAL: Database pool is not available. Exiting.'.red.bold);
      process.exit(1);
    }
    // For pg, pool.connect() is the equivalent of mysql's pool.getConnection()
    // For mysql, it's pool.getConnection()
    return dbType === 'postgres'
      ? pool.connect.bind(pool)
      : pool.getConnection.bind(pool);
  },
  // Expose the pool directly for transaction control in pg
  get pool() {
    return pool;
  }
};
