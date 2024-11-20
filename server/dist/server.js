import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schema/typeDefs.js';
import user_resolvers from './schema/resolvers/user_resolvers.js';
import auth_resolvers from './schema/resolvers/auth_resolvers.js';
import { authenticate } from './services/auth.js';
const resolvers = {
    ...user_resolvers,
    ...auth_resolvers,
};
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Give routes access to req.cookies
app.use(cookieParser());
// if we're in production, serve client/build as static assets and ensure the index.html file is served for the React Router to handle UI views
if (process.env.PORT) {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
}
db.once('open', async () => {
    await server.start();
    app.use('/graphql', 
    // load this after server start
    expressMiddleware(server, {
        context: authenticate,
    }));
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
