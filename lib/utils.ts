import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { TransactionsResponse } from "./types";

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

    console.log("GraphQL response received");

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

// Pagination utility function to fetch all results
export async function fetchAllWithPagination<T>(
  queryFunction: (first: number, after?: string) => Promise<T>,
  first: number = 100
): Promise<T[]> {
  const allResults: T[] = [];
  let hasNextPage = true;
  let after: string | undefined = undefined;

  console.log(`Starting paginated fetch with batch size: ${first}`);

  while (hasNextPage) {
    try {
      console.log(`Fetching batch${after ? ` after cursor: ${after!.substring(0, 20)}...` : ''}`);
      
      const result = await queryFunction(first, after);
      
      // Extract the actual data and pagination info
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (result as any).transactions || (result as any);
      const pageInfo = data.pageInfo;
      const edges = data.edges || [];

      console.log(`Fetched ${edges.length} items in this batch`);

      // Add the results to our collection
      allResults.push(result);

      // Check if there are more pages
      hasNextPage = pageInfo?.hasNextPage || false;
      
      if (hasNextPage && edges.length > 0) {
        // Get the cursor for the next page
        const lastCursor = edges[edges.length - 1].cursor;
        if (lastCursor) {
          after = lastCursor;
          console.log(`Next cursor: ${after?.substring(0, 20)}...`);
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }

      // Add a small delay to avoid rate limiting
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

    } catch (error) {
      console.error("Error during paginated fetch:", error);
      throw error;
    }
  }

  console.log(`Completed paginated fetch. Total batches: ${allResults.length}`);
  return allResults;
}

// Specific function for Drawwy transactions
const query_prod = `
  query GetDrawwyTransactions($first: Int!, $after: String) {
    transactions(
      tags: [
        {
          name: "App-Name"
          values: ["Drawwy"]
        },
        {
          name: "Content-Type"
          values: "image/png"
        }
      ]
      first: $first
      after: $after
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
const query_dev = `
  query GetDrawwyTransactions($first: Int!, $after: String) {
    transactions(
      tags: [
        {
          name: "App-Name"
          values: ["Drawwy-Dev"]
        },
        {
          name: "Content-Type"
          values: "image/png"
        }
      ]
      first: $first
      after: $after
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

// Single page fetch function
export async function fetchDrawwyTransactionsPage(first: number, after?: string): Promise<TransactionsResponse> {
  return makeGraphQLRequest<TransactionsResponse>(
    process.env.NODE_ENV === "development" ? query_dev : query_prod, 
    { first, after }
  );
}

// Fetch all Drawwy transactions with pagination
export async function fetchAllDrawwyTransactions(first: number): Promise<TransactionsResponse[]> {
  return fetchAllWithPagination<TransactionsResponse>(
    (batchSize, cursor) => fetchDrawwyTransactionsPage(batchSize, cursor),
    first
  );
}

// Legacy function for backward compatibility (single page)
export async function fetchDrawwyTransactions(first: number): Promise<TransactionsResponse> {
  return fetchDrawwyTransactionsPage(first);
}

// Function to fetch creator collections by wallet address (single page)
// export async function fetchCreatorCollectionsPage(creatorAddress: string, first: number, after?: string): Promise<CreatorCollectionsResponse> {
//   const query = `
//     query GetCreatorCollections($creatorAddress: String!, $first: Int!, $after: String) {
//       transactions(
//         tags: [
//           {
//             name: "Creator"
//             values: [$creatorAddress]
//           }
//         ]
//         first: $first
//         after: $after
//         sort: HEIGHT_DESC
//       ) {
//         pageInfo {
//           hasNextPage
//         }
//         edges {
//           cursor
//           node {
//             id
//             owner {
//               address
//             }
//             tags {
//               name
//               value
//             }
//             block {
//               id
//               height
//               timestamp
//             }
//           }
//         }
//       }
//     }
//   `;

//   return makeGraphQLRequest<CreatorCollectionsResponse>(query, { creatorAddress, first, after });
// }

// Fetch all creator collections with pagination
// export async function fetchAllCreatorCollections(creatorAddress: string, first: number): Promise<CreatorCollectionsResponse[]> {
//   return fetchAllWithPagination<CreatorCollectionsResponse>(
//     (batchSize, cursor) => fetchCreatorCollectionsPage(creatorAddress, batchSize, cursor),
//     first
//   );
// }

// Legacy function for backward compatibility (single page)
// export async function fetchCreatorCollections(creatorAddress: string, first: number): Promise<CreatorCollectionsResponse> {
//   return fetchCreatorCollectionsPage(creatorAddress, first);
// }
