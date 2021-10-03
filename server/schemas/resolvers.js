const { AuthenticationError } = require("apollo-server-express");
const { Book, User } = require("../models");
const { signToken } = require("../utils/auth");

// context is used to pass info that a resolver needs - like authentication scope
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id);

        return userData;
      } else {
        throw new AuthenticationError("User not logged in.");
      }
    },
  },
  Mutation: {
    login: {},
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: {},
    removeBook: {},
  },
};

module.exports = resolvers;
