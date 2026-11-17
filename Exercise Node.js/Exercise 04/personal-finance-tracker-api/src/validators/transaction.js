const { z } = require('zod');

const transactionFields = {
  title: z.string().trim().min(1).max(120),
  amount: z.coerce.number().refine(value => value !== 0, 'Amount cannot be zero.'),
  type: z.enum(['income', 'expense']),
  category: z.string().trim().min(1).max(60),
  date: z.coerce.date()
};
const createTransactionSchema = z.object({ body: z.object(transactionFields).refine(data => data.type === 'expense' ? data.amount < 0 : data.amount > 0, { message: 'Income must be positive and expense must be negative.', path: ['amount'] }) });
const updateTransactionSchema = z.object({ body: z.object({
  title: transactionFields.title.optional(),
  amount: transactionFields.amount.optional(),
  type: transactionFields.type.optional(),
  category: transactionFields.category.optional(),
  date: transactionFields.date.optional()
}).refine(data => Object.keys(data).length > 0, 'At least one field is required') });
module.exports = { createTransactionSchema, updateTransactionSchema };
