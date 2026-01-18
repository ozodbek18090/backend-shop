// routes/debtorRoutes.js
const express = require('express');
const router = express.Router();
const debtorController = require('../controllers/debtorController');

// Barcha route'lar uchun autentifikatsiya

// Barcha qarzdorlarni olish
router.get('/', debtorController.getAllDebtors);

// Faol qarzdorlarni olish
router.get('/active', debtorController.getActiveDebtors);

// Qarzdor qidirish - BU YO'L MUHIM!
router.get('/search', debtorController.searchDebtors);

// Qarzdorni ID bo'yicha olish
router.get('/:id', debtorController.getDebtorById);

// Yangi qarzdor qo'shish
router.post('/', debtorController.createDebtor);

// Qarzdorni yangilash
router.put('/:id', debtorController.updateDebtor);

// Qarzdorni o'chirish
router.delete('/:id', debtorController.deleteDebtor);

// Qarz qo'shish/kamaytirish
router.patch('/:id/debt', debtorController.updateDebt);

// Statistikani olish
router.get('/stats/totals', debtorController.getDebtStats);

module.exports = router;