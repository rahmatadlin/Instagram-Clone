// Import library dotenv
require("dotenv").config();

// Import ApolloServer dari paket @apollo/server
const { ApolloServer } = require("@apollo/server");

// Mengimpor fungsi startStandaloneServer dari paket @apollo/server/standalone
const { startStandaloneServer } = require("@apollo/server/standalone");

// Mengimpor typeDefs untuk response dan resolver pengguna dari schemas
const { responseTypeDefs } = require("./schemas/response");
const { userTypeDefs, userResolvers } = require("./schemas/user");

// Mengimpor typeDefs dan resolver untuk follow dan post dari schemas
const { followTypeDefs, followResolvers } = require("./schemas/follow");
const { postTypeDefs, postResolvers } = require("./schemas/post");

const PORT = process.env.PORT || 3000; // Di soal minta port 3000

// Mengimpor modul koneksi MongoDB
const mongoConnection = require("./config/mongoConnect");

// Mengimpor modul untuk melakukan otentikasi
const authentication = require("./helpers/auth");

// Membuat instance ApolloServer dengan konfigurasi typeDefs, resolvers, dan opsi lainnya
const server = new ApolloServer({
  typeDefs: [responseTypeDefs, userTypeDefs, followTypeDefs, postTypeDefs],
  resolvers: [userResolvers, followResolvers, postResolvers],
  introspection: true, // ini buat nanti pas deploy aja, jangan lupa dinyalakan
});

// Fungsi self-invoking (IIFE) untuk menjalankan server
(async () => {
  try {
    // Menjalankan koneksi MongoDB
    await mongoConnection.connect();

    // Memulai server standalone Apollo dengan opsi listen dan context
    const { url } = await startStandaloneServer(server, {
      listen: {
        port: PORT,
      },
      context: async ({ req, res }) => {
        // Menyediakan fungsi doAuthentication ke konteks untuk setiap permintaan
        // console.log("this console will be triggered on every request");

        return {
          doAuthentication: () => authentication(req),
        };
      },
    });

    // Menampilkan pesan bahwa server ready
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    // Tampilkan error jangan lupa
    console.log(error);
  }
})();
