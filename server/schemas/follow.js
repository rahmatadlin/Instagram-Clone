// Mengimpor GraphQLError dari paket graphql
const { GraphQLError } = require("graphql");

// Mengimpor model Follow d
const Follow = require("../models/follow");

// Mengimpor instance redis
const redis = require("../config/redis");

// String typeDefs untuk operasi followUser pada GraphQL
const typeDefs = `#graphql
  extend type Mutation {
    followUser(userId: ID!, followUserId: ID!): FollowResponse
  }

  type FollowResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: FollowData
  }

  type FollowData {
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String!
  }
`;

// Resolver untuk operasi followUser pada GraphQL
const resolvers = {
  Mutation: {
    followUser: async (_, { userId, followUserId }) => {
      try {
        // Membuat Redis key berdasarkan userId dan followUserId
        const redisKey = `follow:${userId}:${followUserId}`;
        // Mengecek apakah sudah ada nilai Redis untuk key tersebut
        const redisValue = await redis.get(redisKey);
        if (redisValue) {
          return {
            statusCode: 409,
            message: "Already followed this user",
            data: null,
            error: null,
          };
        }

        // Mengecek apakah userId dan followUserId sama
        if (userId === followUserId) {
          return {
            statusCode: 409,
            message: "You can't follow yourself", // Jangan lupa tambahkan message agar jelas
            data: null,
            error: null,
          };
        }

        // Menyimpan nilai true ke Redis untuk key tersebut
        await redis.set(redisKey, true);

        // Memanggil fungsi followUser dari model Follow
        const result = await Follow.followUser(userId, followUserId);
        console.log(result, "<<<<< result");

        // Mengembalikan respons sesuai dengan hasil operasi followUser
        return {
          statusCode: result.alreadyFollowed ? 409 : 201,
          message: result.message,
          data: result,
          error: null,
        };
      } catch (error) {
        // Error handler
        console.error(`Error in followUser mutation:`, error);
        throw new GraphQLError("Failed to follow user");
      }
    },
  },
};

// Export typeDefs dan resolvers untuk operasi followUser pada GraphQL
module.exports = {
  followTypeDefs: typeDefs,
  followResolvers: resolvers,
};
