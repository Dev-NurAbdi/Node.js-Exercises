function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (err.code === 11000) err.statusCode = 409;
  if (err.name === 'ValidationError' || err.name === 'CastError') err.statusCode = 400;
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

module.exports = { notFound, errorHandler };
