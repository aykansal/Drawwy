import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { TransactionsResponse, CreatorCollectionsResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// GraphQL utility function
export async function makeGraphQLRequest<T>(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>,
  endpoint: string = "https://arweave.net/graphql"
): Promise<T> {
  try {
    const response = await axios.post(endpoint, {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("GraphQL response received:", response.data);

    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
}

// Specific function for Drawwy transactions
export async function fetchDrawwyTransactions(first: number = 100): Promise<TransactionsResponse> {
  const query = `
    query GetDrawwyTransactions($first: Int!) {
      transactions(
        tags: [
          {
            name: "App-Name"
            values: ["Drawwy"]
          }
        ]
        first: $first
        sort: HEIGHT_DESC
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            owner {
              address
            }
            recipient
            fee {
              ar
            }
            quantity {
              ar
            }
            data {
              size
              type
            }
            tags {
              name
              value
            }
            block {
              id
              timestamp
              height
            }
          }
        }
      }
    }
  `;

  return makeGraphQLRequest<TransactionsResponse>(query, { first });
}

// Function to fetch creator collections by wallet address
export async function fetchCreatorCollections(creatorAddress: string, first: number = 100): Promise<CreatorCollectionsResponse> {
  const query = `
    query GetCreatorCollections($creatorAddress: String!, $first: Int!) {
      transactions(
        tags: [
          {
            name: "Creator"
            values: [$creatorAddress]
          }
        ]
        first: $first
        sort: HEIGHT_DESC
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            owner {
              address
            }
            tags {
              name
              value
            }
            block {
              id
              height
              timestamp
            }
          }
        }
      }
    }
  `;

  return makeGraphQLRequest<CreatorCollectionsResponse>(query, { creatorAddress, first });
}
