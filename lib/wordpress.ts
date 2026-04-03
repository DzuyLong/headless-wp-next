const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchWordPress<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${WORDPRESS_API_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  return response.json();
}
