const express = require('express');
const router = express.Router();

const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTodayTransactions,
  getTransactionStats,
  getSalesReport
} = require('../controllers/transactionController');

// GET /api/transactions
router.get('/', getTransactions);

// GET /api/transactions/:id
router.get('/:id', getTransaction);

// POST /api/transactions
router.post('/', createTransaction);

// PUT /api/transactions/:id
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

// GET /api/transactions/today
router.get('/today', getTodayTransactions);

// GET /api/transactions/stats
router.get('/stats', getTransactionStats);

// GET /api/transactions/report/sales
router.get('/report/sales', getSalesReport);

module.exports = router;