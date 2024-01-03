import gql from 'graphql-tag';

const blockFieldsQuery = gql`
  fragment blockFields on Block {
    id
    number
    timestamp
  }
`;

export const blocksQuery = gql`
  query blocksQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: Block_filter
    $orderBy: Block_orderBy = "timestamp"
    $orderDirection: OrderDirection! = "desc"
  ) {
    blocks(
      first: $first
      skip: $skip
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`;
