// backend/controllers/schedule.controller.js
const db = require('../config/db');
const sendResponse = require('../utils/response');

exports.searchSchedules = async (req, res) => {
  try {
    const { tanggal } = req.query;
    if (!tanggal) {
      return sendResponse(res, { code: 400, success: false, message: 'Tanggal wajib diisi', data: null });
    }

    const query = `
      SELECT id, field_id, TO_CHAR(tanggal, 'YYYY-MM-DD') as tanggal, jam_mulai, jam_selesai, status
      FROM schedules
      WHERE tanggal = $1
      ORDER BY jam_mulai ASC
    `;
    const { rows } = await db.query(query, [tanggal]);
    return sendResponse(res, { code: 200, success: true, message: 'Berhasil mengambil jadwal', data: rows });
  } catch (error) {
    console.error('Error searchSchedules:', error);
    return sendResponse(res, { code: 500, success: false, message: error.message, data: null });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { field_id, tanggal, jam_mulai, jam_selesai } = req.body;
    
    if (!field_id || !tanggal || !jam_mulai || !jam_selesai) {
      return sendResponse(res, { code: 400, success: false, message: 'Data jadwal tidak lengkap', data: null });
    }

    const query = `
      INSERT INTO schedules (field_id, tanggal, jam_mulai, jam_selesai, status)
      VALUES ($1, $2, $3, $4, 'tersedia')
      RETURNING id
    `;
    const { rows } = await db.query(query, [field_id, tanggal, jam_mulai, jam_selesai]);

    return sendResponse(res, { code: 201, success: true, message: 'Jadwal berhasil ditambahkan', data: { id: rows[0].id } });
  } catch (error) {
    console.error('Error createSchedule:', error);
    return sendResponse(res, { code: 500, success: false, message: error.message, data: null });
  }
};