import User from '../../models/User.js';
import { signToken, getUserId } from '../../services/auth.js';
import { getErrorMessage } from '../../helpers/index.js';
const auth_resolvers = {
    Query: {
        getUser: async (_, __, { req }) => {
            const user_id = getUserId(req);
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
        registerUser: async (_, { input }, { res }) => {
            try {
                const user = await User.create(input);
                const token = signToken(user._id);
                res.cookie('book_app_token', token, {
                    httpOnly: true,
                    secure: process.env.PORT ? true : false,
                    sameSite: true
                });
                return { user };
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                return {
                    message: errorMessage
                };
            }
        },
        loginUser: async (_, { input }, { res }) => {
            const user = await User.findOne({ email: input.email });
            if (!user) {
                return { message: "No user found with that email address" };
            }
            const valid_pass = await user.validatePassword(input.password);
            if (!valid_pass) {
                return { message: 'Wrong password!' };
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
