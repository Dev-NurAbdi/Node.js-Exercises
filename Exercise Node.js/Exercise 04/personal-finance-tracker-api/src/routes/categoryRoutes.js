const router = require('express').Router();
const { protect } = require('../middleware/auth');

const categories = {
  income: ['Salary', 'Business', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Housing', 'Bills', 'Health', 'Education', 'Shopping', 'Entertainment', 'Travel', 'Other Expense']
};

router.get('/', protect, (req, res) => res.json({ categories }));
module.exports = router;
