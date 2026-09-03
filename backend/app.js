const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const healthRoutes = require('./routes/health.routes');

const authRoutes = require('./routes/auth.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const bookingRoutes = require('./routes/booking.routes');

app.use('/health', healthRoutes);
// Daftarkan endpoint-nya di sini
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(config.port, () => {
  console.log(`Backend jalan di http://localhost:${config.port}`);
});
