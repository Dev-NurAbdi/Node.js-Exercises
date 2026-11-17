const router = require('express').Router();
const controller = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTransactionSchema, updateTransactionSchema } = require('../validators/transaction');

router.use(protect);
router.get('/monthly-summary', controller.monthlySummary);
router.route('/').post(validate(createTransactionSchema), controller.create).get(controller.list);
router.route('/:id').put(validate(updateTransactionSchema), controller.update).delete(controller.remove);
module.exports = router;
