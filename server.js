const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

dotenv.config();

// Routes (AUTH YO‘Q)
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const salesRoutes = require('./routes/salesRoutes');
const debtorRoutes = require('./routes/debtorRoutes');

// Error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ================= CORS ================= */
app.use(cors({
  origin: 'https://frontend-shop-omega.vercel.app',
  credentials: true
}));


/* =============== MIDDLEWARE =============== */
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* =============== ROUTES =================== */
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/debtors', debtorRoutes);

/* =============== TEST ===================== */
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend ishlayapti 🚀',
    time: new Date().toISOString()
  });
});

/* =============== 404 ====================== */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint topilmadi'
  });
});

/* ============ ERROR HANDLER =============== */
app.use(errorHandler);

/* ============ DATABASE ==================== */
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ombor_db'
    );
    console.log('✅ MongoDB ulandi');
  } catch (err) {
    console.error('❌ MongoDB xato:', err.message);
    process.exit(1);
  }
};

connectDB();

/* ============ SERVER ====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portda ishlayapti`);
  console.log(`🔗 http://localhost:${PORT}/api/test`);
});

module.exports = app;
