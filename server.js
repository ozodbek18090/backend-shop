const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

dotenv.config();

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const salesRoutes = require('./routes/salesRoutes');
const debtorRoutes = require('./routes/debtorRoutes');

const app = express();

/* ================= CORS ================= */
app.use(cors({
  origin: [
    'https://inventory-shop-omega.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Preflight requests
app.options('*', cors());

/* =============== MIDDLEWARE =============== */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging
app.use(morgan('dev'));

/* =============== HEALTH CHECK ============= */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🛒 Backend Shop API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      transactions: '/api/transactions',
      sales: '/api/sales',
      debtors: '/api/debtors',
      test: '/api/test'
    }
  });
});

/* =============== TEST ENDPOINT ============ */
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend ishlayapti',
    cors: 'CORS sozlandi',
    time: new Date().toISOString(),
    frontendAllowed: [
      'inventory-shop-omega.vercel.app'
    ]
  });
});

/* =============== ROUTES =================== */
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/debtors', debtorRoutes);

/* =============== 404 HANDLER ============== */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Endpoint topilmadi',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api/test',
      'GET /api/products',
      'GET /api/categories',
      'GET /api/sales',
      'GET /api/debtors',
      'GET /api/transactions'
    ]
  });
});

/* ============ ERROR HANDLER =============== */
app.use((err, req, res, next) => {
  console.error('❌ Server xatosi:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server xatosi',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

/* ============ DATABASE ==================== */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ombor_db';
    console.log('🔗 MongoDB ulanmoqda...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB ulandi');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error('❌ MongoDB xato:', err.message);
    console.log('ℹ️ MongoDB ulanmagan holatda ishlayapmiz...');
  }
};

connectDB();

/* ============ SERVER ====================== */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🛒 BACKEND SHOP API');
  console.log('='.repeat(50));
  console.log(`✅ Server ${PORT} portda ishlayapti`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔗 Products: http://localhost:${PORT}/api/products`);
  console.log(`🌐 CORS allowed: localhost:5173, inventory-shop-omega.vercel.app`);
  console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server yopilmoqda...');
  server.close(() => {
    console.log('✅ Server yopildi');
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;