// Mengimpor library bcryptjs
const bcrypt = require("bcryptjs");

// Membuat salt untuk proses hashing menggunakan bcryptjs
const salt = bcrypt.genSaltSync(10);

// Fungsi untuk melakukan hashing password
const hashPassword = (rawPassword) => {
  return bcrypt.hashSync(rawPassword, salt);
};

// Fungsi untuk membandingkan password raw dengan password yang telah di-hash
const comparePassword = (rawPassword, hashPassword) => {
  return bcrypt.compareSync(rawPassword, hashPassword);
};

// Export
module.exports = { hashPassword, comparePassword };
