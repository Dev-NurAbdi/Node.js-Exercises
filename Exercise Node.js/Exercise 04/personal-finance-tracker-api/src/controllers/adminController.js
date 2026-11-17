const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.overview = async (req, res, next) => {
  try {
    const [totalUsers, totalTransactions, totals, topSpendingCategories] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Transaction.aggregate([{ $group: { _id: '$type', total: { $sum: { $abs: '$amount' } } } }]),
      Transaction.aggregate([
        { $match: { type: 'expense' } },
        { $group: { _id: '$category', totalSpent: { $sum: '$amount' }, transactions: { $sum: 1 } } },
        { $sort: { totalSpent: -1 } }, { $limit: 5 }
      ])
    ]);
    const totalIncome = totals.find(item => item._id === 'income')?.total || 0;
    const totalExpenses = totals.find(item => item._id === 'expense')?.total || 0;
    res.json({ overview: {
      totalUsers, totalTransactions, totalIncome, totalExpenses,
      balance: totalIncome - totalExpenses, topSpendingCategories
    } });
  } catch (error) { next(error); }
};
