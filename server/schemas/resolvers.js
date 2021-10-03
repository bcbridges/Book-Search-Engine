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
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect Credentials.");
      }

      // .isCorrectPassword is a pre defined method on the user model.
      const passwordCheck = await user.isCorrectPassword(password);

      if (!passwordCheck) {
        throw new AuthenticationError("Incorrect Credentials.");
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const addedBook = await User.findByIdAndUpdate(
          {
            _id: context.user._id,
          },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return addedBook;
      }
    },
    removeBook: {},
  },
};

module.exports = resolvers;
