const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Log the full error to the console for better debugging
  console.error('--- UNHANDLED ERROR ---');
  console.error(err);
  console.error('-----------------------');

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Add a more specific check for database connection errors
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    statusCode = 500;
    message =
      'Database connection failed. Please check your credentials in the .env file.';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { notFound, errorHandler };
