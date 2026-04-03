const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://headless.local/wp-json/wp/v2";

export async function fetchWordPress<T>(endpoint: string): Promise<T> {
  const url = `${WORDPRESS_API_URL}${endpoint}`;

  console.log("Fetching WordPress URL:", url);

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  console.log("WordPress response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log("WordPress response error:", errorText);
    throw new Error(`WordPress API error: ${response.status}`);
  }

  const data = await response.json();
  console.log("WordPress response data:", data);

  return data;
}