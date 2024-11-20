import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
/*
  Function that pulls the token cookie from the client request and returns the user's id
  We seperate this function so we can use it for route callbacks or basic controller implentation (ie. getUser in auth_controller)
*/
export const getUserId = (req) => {
    const token = req.cookies?.book_app_token;
    if (!token)
        return false;
    try {
        const { user_id } = verify(token, process.env.JWT_SECRET);
        return user_id;
    }
    catch (error) {
        console.log('JWT VERIFICATON ERROR(auth.ts->getUserId)', error.message);
        return false;
    }
};
export const signToken = (user_id) => {
    try {
        const token = sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });
        return token;
    }
    catch (error) {
        console.log('JTW TOKEN CREATION ERROR(signToken)', error);
        return false;
    }
};
/*
  Route middleware function that blocks an unauthenticated user from triggering a route and attaches the user_id to the req object

  Remember this happens before any resolvers are called
*/
// destructure object 
export const authenticate = async ({ req, res }) => {
    // Get the user's id from the request cookie
    const user_id = getUserId(req);
    // Attach the user's id to the request object
    if (user_id) {
        req.user_id = user_id;
    }
    return { req: req, res: res };
};
