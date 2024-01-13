// Mengimpor ObjectId dari paket mongodb
const { ObjectId } = require("mongodb");

// Mengimpor fungsi getDatabase dari konfigurasi koneksi MongoDB
const { getDatabase } = require("../config/mongoConnect");

// Mengimpor GraphQLError dari paket graphql
const { GraphQLError } = require("graphql");

// Mengimpor fungsi findUserById dari model user
const { findUserById } = require("./user");

class Post {
  // Metode statis untuk mendapatkan koleksi "Posts"
  static collection() {
    const database = getDatabase();
    const postCollection = database.collection("posts");

    return postCollection;
  }

  // Metode statis untuk menambahkan post baru
  static async addPost(payload = {}) {
    try {
      const newPost = await this.collection().insertOne(payload);

      const post = await this.findById(newPost.insertedId);

      return post;
    } catch (error) {
      throw new GraphQLError("Can't post");
    }
  }

  // Metode statis untuk mendapatkan daftar post berdasarkan tanggal dibuat
  static async getPostsByCreatedAt() {
    try {
      const posts = await this.collection()
        .find({ createdAt: { $exists: true, $ne: null } })
        .sort({ createdAt: -1 })
        .toArray();

      return posts;
    } catch (error) {
      //   console.error("Error getting posts by createdAt:", error);
      throw new GraphQLError("Can't find the post");
    }
  }

  // Metode statis untuk mencari post berdasarkan ID
  static async findById(id) {
    try {
      const post = await this.collection().findOne({ _id: new ObjectId(id) });
      if (!post) {
        throw new GraphQLError("Can't find the post");
      }
      return post;
    } catch (error) {
      //   console.error("Error finding post by ID:", error);
      throw new GraphQLError("Can't find the post");
    }
  }

  // Metode statis untuk menambahkan komentar pada suatu post
  static async addComment(postId, comment) {
    try {
      const { authorId, commentText } = comment;

      // Mencari pengguna berdasarkan ID
      const user = await findUserById(authorId);
      if (!user) throw new Error("User not found");

      // Struktur data komentar yang akan ditambahkan
      const commentToAdd = {
        authorId: new ObjectId(authorId),
        content: commentText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Menambahkan komentar pada post
      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: commentToAdd } }
      );

      console.log("result", result);

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to add comment");
      }
      return this.findById(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
      throw new GraphQLError("Failed to add comment");
    }
  }

  // Metode statis untuk like suatu post
  static async likePost(postId, userId) {
    try {
      const likeToAdd = {
        authorId: new ObjectId(userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!likeToAdd.authorId) {
        throw new GraphQLError("Author ID is required for liking a post.");
      }

      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        { $push: { likes: likeToAdd } }
      );

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to like post");
      }

      return this.findById(postId);
    } catch (error) {
      console.error("Error liking post:", error);
      throw new GraphQLError("Failed to like post");
    }
  }

  // Metode statis untuk mendapatkan detail post berdasarkan ID dengan informasi pengguna
  static async getPostByIdWithUserDetails(postId) {
    try {
      const postAggregation = await this.collection()
        .aggregate([
          { $match: { _id: new ObjectId(postId) } },
          {
            $lookup: {
              from: "users",
              let: { commentIds: "$comments.userId", likeIds: "$likes" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $in: ["$_id", "$$commentIds"] },
                        { $in: ["$_id", "$$likeIds"] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    username: 1,
                  },
                },
              ],
              as: "userDetails",
            },
          },
          {
            $addFields: {
              comments: {
                $map: {
                  input: "$comments",
                  as: "comment",
                  in: {
                    text: "$$comment.text",
                    userId: "$$comment.userId",
                    user: {
                      $arrayElemAt: [
                        "$userDetails",
                        {
                          $indexOfArray: [
                            "$userDetails._id",
                            "$$comment.userId",
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              likes: {
                $map: {
                  input: "$likes",
                  as: "like",
                  in: {
                    _id: "$$like",
                    user: {
                      $arrayElemAt: [
                        "$userDetails",
                        { $indexOfArray: ["$userDetails._id", "$$like"] },
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              content: 1,
              tags: 1,
              imgUrl: 1,
              authorId: 1,
              createdAt: 1,
              updatedAt: 1,
              comments: {
                $map: {
                  input: "$comments",
                  as: "comment",
                  in: {
                    text: "$$comment.text",
                    user: "$$comment.user",
                  },
                },
              },
              likes: "$likes.user",
            },
          },
        ])
        .toArray();

      return postAggregation[0] || null;
    } catch (error) {
      console.error("Error in getPostByIdWithUserDetails:", error);
      throw new GraphQLError("Failed to get post details");
    }
  }
}

// Export
module.exports = Post;
