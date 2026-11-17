module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: result.error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
    });
  }
  req.validated = result.data;
  next();
};
