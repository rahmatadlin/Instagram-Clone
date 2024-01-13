const typeDefs = `#graphql
  # Menggunakan interface Response
  interface Response {
    statusCode: Int!
    message: String
    error: String
  }

  # Tipe data untuk data login user
  type UserLoginData {
    token: String
    userId: ID
  }

  # Respon untuk operasi login user
  type ResUserLoginNew implements Response {
    statusCode: Int!
    message: String
    error: String
    data: UserLoginData
  }

  type ResponseUser implements Response {
    statusCode: Int!
    message: String
    error: String
    data: User
  }

  type ResponseById implements Response {
    statusCode: Int!
    message: String
    error: String
    data: User
  }

  type UserResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: User
  }

  type ResponsePost implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }

  type ResponsePostMutation implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }

  # Respon untuk mendapatkan daftar post
  type PostsResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: [Post]
  }

  type PostResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
  }

  type ResponseComment implements Response {
    statusCode: Int!
    message: String
    error: String
    data: Post
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

  type AddPostResponse implements Response {
    statusCode: Int!
    message: String
    error: String
    data: addPost
  }

  type ResponseCommentMutation implements Response {
    statusCode: Int!
    message: String
    error: String
    data: CommentDetail
  }

  type ResponseLikeMutation implements Response {
    statusCode: Int!
    message: String
    error: String
    data: LikeDetail
  }
`;

module.exports = {
  responseTypeDefs: typeDefs,
};
