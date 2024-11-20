import User from '../../models/User.js';
import { signToken } from '../../services/auth.js';
import { getErrorMessage } from '../../helpers/index.js';
import { GraphQLError } from 'graphql';
// const { sign } = jwt;
const auth_resolvers = {
    Query: {
        getUser: async (_, __, { req }) => {
            const user_id = req.user_id;
            if (!user_id) {
                return {
                    user: null
                };
            }
            const user = await User.findById(user_id).select('_id username savedBooks');
            if (!user) {
                return {
                    user: null
                };
            }
            return {
                user: user
            };
        }
    },
    Mutation: {
        async registerUser(_, args, context) {
            try {
                const user = await User.create(args);
                const token = signToken(user._id);
                if (context.res) {
                    context.res.cookie('book_app_token', token, {
                        httpOnly: true,
                        secure: process.env.PORT ? true : false,
                        sameSite: true
                    });
                }
                else {
                    throw new GraphQLError('Response object is not available in context');
                }
                return {
                    user: user
                };
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                console.log(error);
                throw new GraphQLError(errorMessage);
            }
        },
        loginUser: async (_, input, { res }) => {
            const user = await User.findOne({ email: input.email });
            if (!user) {
                throw new GraphQLError("No user found with that email address");
            }
            const valid_pass = await user.validatePassword(input.password);
            if (!valid_pass) {
                throw new GraphQLError('Wrong password!');
            }
            const token = signToken(user._id);
            res.cookie('book_app_token', token, {
                httpOnly: true,
                secure: process.env.PORT ? true : false,
                sameSite: true
            });
            return { user };
        },
        logoutUser: async (_, __, { res }) => {
            res.clearCookie('book_app_token');
            return {
                message: 'Logged out successfully!'
            };
        }
    }
};
export default auth_resolvers;
