// controllers/booking.controller.js
const db = require('../config/db');
const { sendResponse } = require('../utils/response');

exports.createBooking = async (req, res) => {
  try {
    const { schedule_id, nama_pelanggan, kontak, metode_pembayaran } = req.body;
    const status = 'menunggu konfirmasi';

    // Query insert data dengan PostgreSQL ($1, $2, dst)
    const query = `
      INSERT INTO bookings (schedule_id, nama_pelanggan, kontak, metode_pembayaran, status, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING id
    `;
    const { rows } = await db.query(query, [schedule_id, nama_pelanggan, kontak, metode_pembayaran, status]);

    return sendResponse(res, { code: 201, success: true, message: 'Pemesanan berhasil dibuat', data: { booking_id: rows[0].id } });
  } catch (error) {
    return sendResponse(res, { code: 500, success: false, message: 'Gagal membuat pemesanan', data: error.message });
  }
};