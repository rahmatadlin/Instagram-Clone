// Mengimpor library MongoClient dari MongoDB
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI; // Kalau pakau env
// const uri = "mongodb+srv://rahmatadlin210:qrx0oXE4iedQdrH9@cluster0.qm77h7q.mongodb.net/";


const client = new MongoClient(uri);
// const dbName = process.env.MONGODB_DBNAME;

// Fungsi async untuk melakukan koneksi ke MongoDB
async function connect() {
  try {
    await client.connect();
    console.log("Successfully to connect mongodb");
    return client;
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await client.close();
    throw error;
  }
}

// Fungsi untuk mendapatkan objek database dari koneksi MongoDB
// Database sesuaikan dengan yang telah dibuat di mongo Atlas ataupu Compass
function getDatabase() {
  return client.db("project-instagram");
}

module.exports = {
  connect,
  getDatabase,
  client,
};