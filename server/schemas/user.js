// Mengimpor GraphQLError dari package graphql
const { GraphQLError } = require("graphql");

// Mengimpor fungsi-fungsi dari model user
const {
  register,
  findUserById,
  findOneUser,
  searchByUsername,
  createOne,
  getUserByIdWithFollowDetails,
} = require("../models/user");

// Mengimpor fungsi followUser dari model follow
const { followUser } = require("../models/follow");

// Mengimpor fungsi comparePassword dan generateToken dari helper bcrypt dan jwt
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

const { ObjectId } = require("mongodb");


// Mengimpor validator untuk validasi input
const validator = require("validator");

// Tipe data GraphQL untuk User
const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    followers: [followerDetails]  
    following: [followingDetails]  
  }

  type followerDetails {
    _id: ID
    username: String
  }

  type followingDetails {
    _id: ID
    username: String
  }

  type Query {
    login(email: String!, password: String!): ResUserLoginNew 
    getUser(_id: ID!): ResponseById
    searchUsersByUsername(username: String!): [User]
    currentUser: UserResponse
  }

  input RegisterInput {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input GetUserIdInput {
    _id: ID!
  }
  
  
  type Mutation {
    register(input: RegisterInput): ResponseUser
  }
`;

// Resolver untuk operasi GraphQL pada User
const resolvers = {
  Query: {
    login: async (_, args) => {
      try {
        const { email, password } = args;
        console.log(args);

        // Validasi apabaila field username atau password kosong
        if (!email || !password) {
          throw new GraphQLError("Email and password are required");
        }

        // Validasi email format dengan package validator
        if (!validator.isEmail(email)) {
          throw new GraphQLError("Invalid Email Format");
        }

        const user = await findOneUser({ email });
      
        console.log(user);

        if (!user || !comparePassword(password, user.password)) {
          throw new GraphQLError("Invalid username or password");
        }

        // Membuat payload untuk token
        const payload = {
          id: user._id,
          email: user.email,
        };

        // Mengenerate token menggunakan fungsi generateToken
        const token = generateToken(payload);

        return {
          statusCode: 200,
          message: `Successfully to login`,
          data: {
            token,
            userId: user._id,
          },
        };
      } catch (error) {
        throw error;
      }
    },
    getUser: async (_, { _id }) => {
      try {
        const user = await getUserByIdWithFollowDetails(_id);
        if (!user) {
          throw new GraphQLError("User not found");
        }
        return {
          statusCode: 200,
          message: `Successfully to get user`,
          data: user,
        };
      } catch (error) {
        console.error("Error in getUser resolver:", error);
        throw new GraphQLError("Failed to get user");
      }
    },
    searchUsersByUsername: async (_, { username }) => {
      try {
        return await searchByUsername(username);
      } catch (error) {
        console.error("Error in searchUsersByUsername query:", error);
        throw new GraphQLError("Failed to search users");
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      try {
        const { name, username, email, password } = args.input;

        // Validate email format
        if (!validator.isEmail(email)) {
          throw new GraphQLError("Invalid Email Format");
        }

        // Cek apakah username atau email sudah pernah exist
        const existingUser = await findOneUser({
          $or: [{ username }, { email }],
        });

        if (existingUser) {
          if (existingUser.username === username) {
            throw new GraphQLError("Username Already Exists");
          } else {
            throw new GraphQLError("Email Already Exists");
          }
        }

        // Cek apakah password kurang dari 5 karakter
        if (password.length < 5) {
          throw new GraphQLError("Password must be at least 5 characters");
        }

        const user = await register({
          name,
          username,
          email,
          password,
        });

        return {
          statusCode: 200,
          message: `Successfully to register`,
          data: user,
        };
      } catch (error) {
        throw error;
      }
    },
    followUser: async (_, { userId, followUserId }) => {
      try {
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(followUserId)) {
          throw new GraphQLError("Invalid user ID");
        }

        // Panggil followUser
        const result = await followUser(userId, followUserId);
        return {
          statusCode: result.alreadyFollowed ? 409 : 201,
          message: result.message,
          data: result,
          error: null,
        };
      } catch (error) {
        console.error(`Error in followUser mutation:`, error);
        throw new GraphQLError("Failed to follow user");
      }
    },
  },
};

module.exports = {
  userTypeDefs: typeDefs,
  userResolvers: resolvers,
};
