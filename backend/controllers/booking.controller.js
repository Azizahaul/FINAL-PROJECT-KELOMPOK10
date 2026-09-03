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

exports.validateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Isinya: 'dikonfirmasi' atau 'dibatalkan'

    // 1. Update status pemesanan
    await db.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);

    // 2. Jika dikonfirmasi, kunci jadwalnya menjadi 'terisi'
    if (status === 'dikonfirmasi') {
      const { rows } = await db.query('SELECT schedule_id FROM bookings WHERE id = $1', [id]);
      if (rows.length > 0) {
        await db.query('UPDATE schedules SET status = $1 WHERE id = $2', ['terisi', rows[0].schedule_id]);
      }
    }

    return sendResponse(res, { code: 200, success: true, message: `Pemesanan berhasil ${status}`, data: null });
  } catch (error) {
    return sendResponse(res, { code: 500, success: false, message: 'Gagal memvalidasi pemesanan', data: error.message });
  }
};