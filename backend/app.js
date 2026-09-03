// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const bookingRoutes = require('./routes/booking.routes');
const chatRoutes = require('./routes/chat.routes');

// Registrasi Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Backend] Server berhasil jalan di port ${PORT}`);
});