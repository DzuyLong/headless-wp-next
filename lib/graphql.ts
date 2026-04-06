const WORDPRESS_GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT || "http://headless.local/graphql";

type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(WORDPRESS_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    console.error("GraphQL errors:", json.errors);
    throw new Error(json.errors.map((err) => err.message).join(", "));
  }

  if (!json.data) {
    throw new Error("GraphQL response has no data");
  }

  return json.data;
}