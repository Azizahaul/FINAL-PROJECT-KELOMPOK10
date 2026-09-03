// routes/booking.routes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.post('/', bookingController.createBooking);

router.put('/:id/validate', bookingController.validateBooking);
module.exports = router;