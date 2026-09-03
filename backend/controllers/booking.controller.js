// controllers/booking.controller.js
const db = require('../config/db');
const sendResponse = require('../utils/response');

exports.createBooking = async (req, res) => {
  try {
    const { schedule_id, nama_pemesan, nama_pelanggan, whatsapp, kontak, metode_pembayaran } = req.body;
    
    const finalNama = nama_pemesan || nama_pelanggan;
    const finalKontak = whatsapp || kontak;
    const finalMetode = metode_pembayaran || 'transfer';
    const bukti_transfer = req.body.bukti_transfer || (finalMetode === 'transfer' ? 'bukti_transfer.jpg' : 'cod');
    const nama_rekening = req.body.nama_rekening || finalNama;

    if (!schedule_id || !finalNama || !finalKontak) {
      return sendResponse(res, { code: 400, success: false, message: 'Data pemesanan tidak lengkap', data: null });
    }

    const checkSlot = await db.query('SELECT status FROM schedules WHERE id = $1', [schedule_id]);
    
    if (checkSlot.rows.length === 0) {
      return sendResponse(res, { code: 404, success: false, message: 'Jadwal tidak ditemukan', data: null });
    }
    if (checkSlot.rows[0].status !== 'tersedia') {
      return sendResponse(res, { code: 400, success: false, message: 'Maaf, slot jadwal ini sudah terisi. Silakan pilih jadwal lain.', data: null });
    }

    // Sesuai PRD FR-4.4: COD langsung dikonfirmasi, Transfer berstatus 'menunggu konfirmasi'
    const status = (finalMetode === 'cod') ? 'dikonfirmasi' : 'menunggu konfirmasi';

    const query = `
      INSERT INTO bookings (schedule_id, nama_pelanggan, kontak, metode_pembayaran, nama_rekening, bukti_transfer, status, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING id
    `;
    const { rows } = await db.query(query, [schedule_id, finalNama, finalKontak, finalMetode, nama_rekening, bukti_transfer, status]);

    if (status === 'dikonfirmasi') {
      await db.query('UPDATE schedules SET status = $1 WHERE id = $2', ['terisi', schedule_id]);
    }

    return sendResponse(res, { code: 201, success: true, message: 'Pemesanan berhasil dikirim!', data: { booking_id: rows[0].id } });
  } catch (error) {
    console.error('Error createBooking:', error);
    return sendResponse(res, { code: 500, success: false, message: 'Gagal membuat pemesanan', data: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const query = `
      SELECT b.id, 
             b.nama_pelanggan as nama_pemesan, 
             b.kontak as whatsapp, 
             b.metode_pembayaran, b.status, b.bukti_transfer, b.nama_rekening,
             TO_CHAR(s.tanggal, 'YYYY-MM-DD') as tanggal, s.jam_mulai, s.jam_selesai, f.nama as nama_lapangan
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN fields f ON s.field_id = f.id
      ORDER BY b.id DESC
    `;
    const { rows } = await db.query(query);
    return sendResponse(res, { code: 200, success: true, message: 'Berhasil mengambil daftar booking', data: rows });
  } catch (error) {
    console.error('Error getAllBookings:', error);
    return sendResponse(res, { code: 500, success: false, message: error.message, data: null });
  }
};

const handleUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const query = `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING schedule_id`;
    const { rows } = await db.query(query, [status, id]);

    if (rows.length === 0) {
      return sendResponse(res, { code: 404, success: false, message: 'Booking tidak ditemukan', data: null });
    }

    const scheduleId = rows[0].schedule_id;

    if (status === 'dikonfirmasi') {
      await db.query('UPDATE schedules SET status = $1 WHERE id = $2', ['terisi', scheduleId]);
    }
    
    if (status === 'dibatalkan' || status === 'selesai' || status === 'telah bermain') {
      await db.query('UPDATE schedules SET status = $1 WHERE id = $2', ['tersedia', scheduleId]);
    }

    return sendResponse(res, { code: 200, success: true, message: `Status berhasil diupdate menjadi ${status}`, data: null });
  } catch (error) {
    console.error('Error update status:', error);
    return sendResponse(res, { code: 500, success: false, message: 'Gagal memvalidasi pemesanan', data: error.message });
  }
};

exports.updateBookingStatus = handleUpdateStatus;
exports.validateBooking = handleUpdateStatus;

exports.checkBookingStatus = async (req, res) => {
  try {
    const { kontak, whatsapp, hp, nomor } = req.query;
    const searchKey = kontak || whatsapp || hp || nomor;

    if (!searchKey) {
      return sendResponse(res, { code: 400, success: false, message: 'Nomor kontak/WhatsApp wajib diisi', data: null });
    }

    const query = `
      SELECT b.id, 
             b.nama_pelanggan as nama_pemesan, 
             b.kontak as whatsapp, 
             b.metode_pembayaran, b.status, 
             TO_CHAR(s.tanggal, 'YYYY-MM-DD') as tanggal, s.jam_mulai, s.jam_selesai, f.nama as nama_lapangan
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN fields f ON s.field_id = f.id
      WHERE b.kontak ILIKE $1
      ORDER BY b.created_at DESC
    `;
    const { rows } = await db.query(query, [`%${searchKey}%`]);

    return sendResponse(res, { code: 200, success: true, message: 'Data status booking ditemukan', data: rows });
  } catch (error) {
    console.error('Error checkBookingStatus:', error);
    return sendResponse(res, { code: 500, success: false, message: 'Gagal mengecek status booking', data: error.message });
  }
};