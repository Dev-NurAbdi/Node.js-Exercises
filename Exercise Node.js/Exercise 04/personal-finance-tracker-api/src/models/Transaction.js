const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  amount: { type: Number, required: true, validate: { validator: function(value) { return this.type === 'expense' ? value < 0 : value > 0; }, message: 'Income must be positive and expense must be negative.' } },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('Transaction', transactionSchema);
