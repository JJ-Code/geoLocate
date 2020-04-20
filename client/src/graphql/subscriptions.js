// FILE TO INSTRUCT REACT THROUGH APOLLO HOW TO HANDLE SUBSCRIPTION WITH GRAPHQL
import gql from 'graphql-tag';

// same values as what's return from the mutation except for Added we return comments {} even though it's an empty array at the beginning
export const PIN_ADDED_SUBSCRIPTION = gql `
  subscription {
    pinAdded {
       _id
      createdAt
      title 
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;

export const PIN_UPDATED_SUBSCRIPTION = gql `
  subscription {
    pinUpdated {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;

export const PIN_DELETED_SUBSCRIPTION = gql `
  subscription {
    pinDeleted {
      _id
    }
  }
`;