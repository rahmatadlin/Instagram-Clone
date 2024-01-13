// Mengimpor GraphQLError dari paket graphql
const { GraphQLError } = require("graphql");

// Mengimpor fungsi verifyToken dari modul jwt
const { verifyToken } = require("./jwt");

// Mengimpor fungsi findOneUser dari modul user dalam models
const { findOneUser } = require("../models/user");

// Mengimpor ObjectId dari paket mongodb
const { ObjectId } = require("mongodb");

// Fungsi untuk melakukan authentication user
const authentication = async (req) => {
  console.log("Function Authentication Berhasil");
  // throw new GraphQLError("Ga boleh masukkk");

  // Mendapatkan nilai dari header 'authorization' pada permintaan (request)
  const headerAuthorization = req.headers.authorization;

  // console.log(headerAuthorization, "<<< header auth");

   // Memeriksa apakah headerAuthorization tidak ada
  if (!headerAuthorization) {
    throw new GraphQLError("Invalid token", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  // Mendapatkan nilai token dari headerAuthorization
  const token = headerAuthorization.split(" ")[1];

  // Mendekode token menggunakan fungsi verifyToken dari modul jw
  const decodedToken = verifyToken(token);
  // console.log(decodedToken, "<<< decoded token");


   // Mencari pengguna berdasarkan id dan email yang terdapat dalam decodedToken
  const user = await findOneUser({
    _id: new ObjectId(decodedToken.id),
    email: decodedToken.email,
  });

    // Memeriksa apakah pengguna tidak ditemukan
  if (!user) {
    throw new GraphQLError("Invalid token", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

    // Mengembalikan objek pengguna yang terotentikasi
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  };
};

// Export
module.exports = authentication;
