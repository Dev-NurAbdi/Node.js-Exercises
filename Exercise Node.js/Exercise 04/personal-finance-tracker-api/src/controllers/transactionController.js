const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

exports.create = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json({ message: 'Transaction created.', transaction });
  } catch (error) { next(error); }
};

exports.list = async (req, res, next) => {
  try {
    const { type, category, from, to, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.min(100, Math.max(1, Number(limit)));
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
      Transaction.countDocuments(filter)
    ]);
    res.json({ total, page: safePage, pages: Math.ceil(total / safeLimit), transactions });
  } catch (error) { next(error); }
};

exports.monthlySummary = async (req, res, next) => {
  try {
    const now = new Date();
    const year = Number(req.query.year || now.getFullYear());
    const month = Number(req.query.month || now.getMonth() + 1);
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Provide a valid year and month (1-12).' });
    }
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    const rows = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id), date: { $gte: start, $lt: end } } },
      { $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: { $abs: '$amount' } }, count: { $sum: 1 }
      } },
      { $sort: { '_id.type': 1, total: -1 } }
    ]);
    const summary = { year, month, totalIncome: 0, totalExpenses: 0, balance: 0, byCategory: [] };
    for (const row of rows) {
      if (row._id.type === 'income') summary.totalIncome += row.total;
      else summary.totalExpenses += row.total;
      summary.byCategory.push({ type: row._id.type, category: row._id.category, total: row.total, count: row.count });
    }
    summary.balance = summary.totalIncome - summary.totalExpenses;
    res.json({ summary });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    const nextType = req.body.type || transaction.type;
    const nextAmount = req.body.amount !== undefined ? req.body.amount : transaction.amount;
    if ((nextType === 'expense' && nextAmount >= 0) || (nextType === 'income' && nextAmount <= 0)) {
      return res.status(400).json({ message: 'Income amount must be positive; expense amount must be negative.' });
    }
    Object.assign(transaction, req.body);
    await transaction.save();
    res.json({ message: 'Transaction updated.', transaction });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ message: 'Transaction deleted.' });
  } catch (error) { next(error); }
};
