// Mengimpor library jsonwebtoken
const jwt = require("jsonwebtoken");

// Mendapatkan nilai secret untuk pembuatan dan verifikasi token dari environment variable
const secret = process.env.JWT_SECRET;

// Fungsi untuk menghasilkan token berdasarkan payload
const generateToken = (payload) => {
  return jwt.sign(payload, secret);
};

// Fungsi untuk memverifikasi token
const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

// Export
module.exports = {
  generateToken,
  verifyToken,
};
