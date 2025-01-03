import User from '../../models/User.js';
import { getErrorMessage } from '../../helpers/index.js';
import { GraphQLError } from 'graphql';
const user_resolvers = {
    Query: {
        getUserBooks: async (_, __, { req }) => {
            const user_id = req.user_id;
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
        saveBook: async (_, { book }, { req }) => {
            if (!req.user_id) {
                throw new GraphQLError('You must be logged in to perform this action');
            }
            try {
                await User.findOneAndUpdate({ _id: req.user_id }, { $addToSet: { savedBooks: book } }, { new: true, runValidators: true });
                // Return generic response - This is NOT used on the client-side, but we must return a response
                return {
                    message: 'Book saved successfully!'
                };
            }
            catch (error) {
                console.log('SAVE BOOK ERROR', error);
                const errorMessage = getErrorMessage(error);
                throw new GraphQLError(errorMessage);
            }
        },
        deleteBook: async (_, { bookId }, { req }) => {
            const updatedUser = await User.findOneAndUpdate({ _id: req.user_id }, { $pull: { savedBooks: { googleBookId: bookId } } }, { new: true });
            if (!updatedUser) {
                throw new GraphQLError("Couldn't find user with this id!");
            }
            // Return generic response - This is NOT used on the client-side, but we must return a response
            return {
                message: 'Book deleted successfully!'
            };
        }
    }
};
export default user_resolvers;
