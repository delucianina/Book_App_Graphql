import User from '../../User.js';
import { getUserId } from '../../../services/auth.js';
import { getErrorMessage } from '../../../helpers/index.js';

const user_resolvers = {
  Query: {
    getUserBooks: async (_: any, __: any, { req }: { req: any }) => {
      const user_id = getUserId(req);

      // If the client didn't send a cookie, we just send back an empty array
      if (!user_id) {
        return [];
      }

      const user = await User.findById(user_id);

      // Return just the user's books array, not the user object
      return user?.savedBooks;
    }
  },
  Mutation: {
    saveBook: async (_: any, { book }: { book: any }, { req }: { req: any }) => {
      try {
        await User.findOneAndUpdate(
          { _id: req.user_id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );

        // Return generic response - This is NOT used on the client-side, but we must return a response
        return {
          message: 'Book saved successfully!'
        };
      } catch (error) {
        console.log('SAVE BOOK ERROR', error);

        const errorMessage = getErrorMessage(error);

        return {
          message: errorMessage
        };
      }
    },
    deleteBook: async (_: any, { bookId }: { bookId: string }, { req }: { req: any }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { savedBooks: { googleBookId: bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        return { message: "Couldn't find user with this id!" };
      }

      // Return generic response - This is NOT used on the client-side, but we must return a response
      return {
        message: 'Book deleted successfully!'
      };
    }
  }
};

export default user_resolvers;