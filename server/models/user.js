// Mengimpor ObjectId dari paket mongodb
const { ObjectId } = require("mongodb");

// Mengimpor fungsi getDatabase dari konfigurasi koneksi MongoDB
const { getDatabase } = require("../config/mongoConnect");

// Mengimpor fungsi hashPassword dari helper bcrypt
const { hashPassword } = require("../helpers/bcrypt");

// Mengimpor GraphQLError dari paket graphql
const { GraphQLError } = require("graphql");


// Fungsi untuk mendapatkan koleksi "Users"
const getCollection = () => {
  const database = getDatabase();
  const userCollection = database.collection("users");

  return userCollection;
};

// Fungsi untuk melakukan registrasi user baru
const register = async (payload = {}) => {
  try {
    payload.password = hashPassword(payload.password);

    const newUser = await getCollection().insertOne(payload);

    const user = await findUserById(newUser.insertedId, true);

    return user;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mencari user berdasarkan ID
const findUserById = async (id, hidePassword) => {
  const options = {};

  if (hidePassword) {
    options.projection = {
      password: 0,
    };
  }
  const user = await getCollection().findOne(
    {
      _id: new ObjectId(id),
    },
    // {
    //   projection: {
    //     // _id: 1,
    //     password: 0
    //   }
    // }
    options
  );

  return user;
};

// Fungsi untuk mencari satu pengguna berdasarkan filter tertentu
const findOneUser = async (filterQuery = {}, hidePassword = false) => {
  const options = {};

  if (hidePassword) {
    options.projection = {
      password: 0,
    };
  }

  const user = await getCollection().findOne(filterQuery, options);
  console.log(filterQuery);

  return user;
};

// Fungsi untuk mencari pengguna berdasarkan nama pengguna (username)
const searchByUsername = async (username) => {
  const regex = new RegExp(username, "i");
  return await getCollection()
    .find({ username: { $regex: regex } }, { projection: { password: 0 } })
    .toArray();
};

// Fungsi untuk membuat satu dokumen user baru
const createOne = async (payload = {}) => {
  try {
    payload.password = hashPassword(payload.password);

    const newUser = await getCollection().insertOne(payload);

    const user = await findById(newUser.insertedId, true);

    return user;
  } catch (error) {
    throw new GraphQLError("Failed to create new user");
  }
};

// Fungsi untuk mendapatkan data pengguna dengan detail terkait jumlah followings dan followers
const getUserByIdWithFollowDetails = async (userId) => {
  try {
    const userAggregation = await getCollection()
      .aggregate([
        // Aggreagate Disini

        { $match: { _id: new ObjectId(userId) } },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "following",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followers.followingId",
            foreignField: "_id",
            as: "followerDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following.followerId",
            foreignField: "_id",
            as: "followingDetails",
          },
        },
        {
          $project: {
            username: 1,
            email: 1,
            followers: {
              $map: {
                input: "$followerDetails",
                as: "fd",
                in: {
                  _id: "$$fd._id",
                  username: "$$fd.username",
                },
              },
            },
            following: {
              $map: {
                input: "$followingDetails",
                as: "fd",
                in: {
                  _id: "$$fd._id",
                  username: "$$fd.username",
                },
              },
            },
          },
        },
      ])
      .toArray();

    return userAggregation[0] || null;
  } catch (error) {
    console.error("Error in getUserByIdWithFollowDetails:", error);
    throw new GraphQLError("Failed to get user details");
  }
};


// Export
module.exports = {
  register,
  findUserById,
  findOneUser,
  searchByUsername,
  createOne,
  getUserByIdWithFollowDetails,
};
