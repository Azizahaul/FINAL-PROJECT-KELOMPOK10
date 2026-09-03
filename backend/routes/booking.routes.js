// backend/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// PENTING: /status harus di atas /:id
// Tambahkan baris ini di booking.routes.js
router.get('/check', bookingController.checkBookingStatus);
router.get('/status', bookingController.checkBookingStatus); // cadangan
router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.put('/:id/status', bookingController.updateBookingStatus);
router.put('/:id/validate', bookingController.validateBooking);

module.exports = router;