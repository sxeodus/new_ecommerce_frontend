import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import colors from 'colors';

// This will load the variables from the .env file
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST, // Corrected from MYSQL_HOST
  user: process.env.DB_USER, // Corrected from MYSQL_USER
  password: process.env.DB_PASSWORD, // Corrected from MYSQL_PASSWORD
  database: process.env.DB_DATABASE, // Corrected from MYSQL_DATABASE
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

// Self-executing async function to create and check the pool on startup
(async () => {
  try {
    pool = mysql.createPool(dbConfig);
    // Test the connection
    const connection = await pool.getConnection();
    connection.release();
    console.log('MySQL Database connected successfully'.cyan.underline);
  } catch (error) {
    console.error(`FATAL: Database connection failed.`.red.bold.underline);
    console.error(`Error: ${error.message}`.red);
    console.error(
      'Please ensure the database is running and .env credentials are correct.'.yellow
    );
    process.exit(1); // Exit if the initial connection fails
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
};
