// DONE:   Create a schemas directory within src and add the following files:

// resolvers.ts: Export an object with sub Query and Mutation objects within it. Convert the functions in src/controllers/user_controllers.ts and src/controllers/auth_controllers.ts to resolvers within the respective Query and Mutation objects.

// Hint: Read through the functions in the controller files thoroughly before moving the functionality code over.

// Bonus: Create a nested resolvers folder within schemas and make an auth_resolvers.ts and user_resolvers.ts file to seperate the resolver functionality. You will then need to import them into resolvers.ts and spread the Query and Mutation objects into their respective properties. (Refer to our example in-class application for help) 

// import { Request, Response } from 'express';
// // import user model
// import User from './typeDefs';
// // import sign token function from auth
// import { signToken, getUserId } from '../../services/auth.js';
// import { getErrorMessage } from '../../controllers/helpers/index.js';

// import { Types } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import user_resolvers from './resolvers/user_resolvers';
import auth_resolvers from './resolvers/auth_resolvers';




const resolvers = {
  Query: {
    ...auth_resolvers.Query,
    ...user_resolvers.Query
  },

  Mutation: {
    ...auth_resolvers.Mutation,
    ...user_resolvers.Mutation 
  }
};

export default resolvers;