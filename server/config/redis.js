// Require dulu setelah npm i ioredis
const Redis = require("ioredis");

// Karena pakai redislab maka masukkan ini
// Menginisialisasi klien Redis dengan detail koneksi untuk RedisLab
const redis = new Redis({
  port: 16042, // Redis port
  host: "redis-16042.c1.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
  // username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASS  // Kalau pakai env
  // password: "3WZdNiV7BMLwWVoP7heIPuGkvoqPN043",  // Kata sandi Redis pada database yang dimiliki
});

// Event handler when successfully connected to Redis
// Redis tidak 24/7 dan juga pastikan memiliki koneksi yang stabil agar tidak connection timeout
redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

// Event handler for any errors connecting to Redis
redis.on("error", (error) => {
  console.error("Error connecting to Redis:", error);
});

// Export
module.exports = redis;
