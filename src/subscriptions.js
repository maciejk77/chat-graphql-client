import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;
