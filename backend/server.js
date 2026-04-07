const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require("path");

// Routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const healthInfoRoutes = require('./routes/healthInfoRoutes');

dotenv.config();

// Connect DB
connectDB();

const app = express();


// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL , 'http://localhost:5173' ,"https://med-care-plum-eight.vercel.app"],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

app.get("/",(req,res)=>{
  res.json({message:"server is running...🚀"})
})

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/healthinfo', healthInfoRoutes);



// ✅ 404 handler (LAST)
app.use((_req, res) =>
  res.status(404).json({ message: 'Route not found' })
);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});