// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendResponse } = require('../utils/response');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Cari user admin (pakai $1 untuk PostgreSQL)
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
    
    if (rows.length === 0) {
      return sendResponse(res, { code: 401, success: false, message: 'Admin tidak ditemukan', data: null });
    }

    const admin = rows[0];
    
    // Cek kecocokan password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return sendResponse(res, { code: 401, success: false, message: 'Password salah', data: null });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username }, 
      process.env.JWT_SECRET || 'secret-key-lokal', 
      { expiresIn: '1d' }
    );

    return sendResponse(res, { code: 200, success: true, message: 'Login berhasil', data: { token, username: admin.username } });
  } catch (error) {
    return sendResponse(res, { code: 500, success: false, message: 'Error server', data: error.message });
  }
};