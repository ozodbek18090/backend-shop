// models/Debtor.js - to'liq to'g'rilangan
const mongoose = require('mongoose');

// Transaction schemasi
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'payment', 'adjustment', 'refund'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale'
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, { _id: true });

const debtorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ism kiriting'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Telefon raqami kiriting'],
    trim: true
  },
  debtAmount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Qarz miqdori 0 dan kam bo\'lishi mumkin emas']
  },
  maxDebtAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'paid', 'overdue'],
    default: 'active'
  },
  // ✅ BU MAYDON MAVJUD BO'LISHI KERAK
  transactions: [transactionSchema],
  
  lastTransactionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware - qarz o'zgarganda
debtorSchema.pre('save', function(next) {
  // Qarz 0 bo'lsa statusni yangilash
  if (this.debtAmount <= 0) {
    this.status = 'paid';
  } else {
    this.status = 'active';
  }
  
  // updatedAt ni yangilash
  this.updatedAt = Date.now();
  
  next();
});

// Faqat faol qarzdorlarni olish uchun
debtorSchema.query.active = function() {
  return this.where({ debtAmount: { $gt: 0 } });
};

const Debtor = mongoose.model('Debtor', debtorSchema);

module.exports = Debtor;