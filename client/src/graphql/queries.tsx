import { gql } from '@apollo/client';

export const GET_USER = gql`
    query getUser {
        getUser {
            user {
                _id
                username
                email
            }
        }
    }
`;

export const GET_USER_BOOKS = gql`
    query getUserBooks {
        getUserBooks {
            googleBookId
            authors
            description
            image
            title
        }
    }
`;