// Mengimpor ObjectId dari paket mongodb
const { ObjectId } = require("mongodb");

// Mengimpor fungsi getDatabase dari modul mongoConnect dalam konfigurasi
const { getDatabase } = require("../config/mongoConnect");

// Mengimpor GraphQLError dari paket graphql
const { GraphQLError } = require("graphql");

// Fungsi untuk mendapatkan koleksi "Follows" dari database
function collection() {
  const database = getDatabase();
  return database.collection("follows");
}

// Fungsi untuk melakukan follow pada user
async function followUser(userId, followUserId) {
  try {
    const follow = await collection().findOne({
      followingId: new ObjectId(userId),
      followerId: new ObjectId(followUserId),
    });

    // Jika sudah ada data follow, kembalikan respons yang sesuai
    if (follow) {
      return {
        alreadyFollowed: true,
        message: "Already follow this user",
      };
    }

    // Jika belum ada data follow, buat data baru dan masukkan ke koleksi
    const newFollow = await collection().insertOne({
      followingId: new ObjectId(userId),
      followerId: new ObjectId(followUserId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Jika tidak berhasil menyisipkan data baru, lemparkan GraphQLError
    if (!newFollow.insertedId) {
      throw new GraphQLError("Failed to follow this user");
    }

    // Ambil data follow yang baru saja disisipkan
    const followData = await collection().findOne({
      _id: new ObjectId(newFollow.insertedId),
    });

    //  Coba console.log data follow yang baru saja disisipkan dan kembalikan data tersebut
    console.log("followData", followData);
    return followData;
  } catch (error) {
    // Error handler dengan menampilkan pesan error dan melemparkan GraphQLError
    console.error("Error following this user:", error);
    throw new GraphQLError("Failed to follow this user");
  }
}

// Export
module.exports = {
  collection,
  followUser,
};
