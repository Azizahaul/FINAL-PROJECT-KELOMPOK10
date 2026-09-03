// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return sendResponse(res, { code: 401, success: false, message: 'Akses ditolak, token tidak ditemukan', data: null });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key-lokal', (err, user) => {
    if (err) {
      return sendResponse(res, { code: 403, success: false, message: 'Token tidak valid atau sudah kedaluwarsa', data: null });
    }
    req.user = user; 
    next();
  });
};

module.exports = verifyToken;