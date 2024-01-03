import gql from 'graphql-tag';

export const bundleQuery = gql`
  query bundleQuery($id: ID!) {
    bundle(id: $id) {
      id
      ethPrice
    }
  }
`;

export const tokensQuery = gql`
  query tokensQuery {
    tokens(first: 1000) {
      address: id
      derivedETH
      decimals
      name
      symbol
    }
  }
`;
