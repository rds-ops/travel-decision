const INTERNAL_API_URL = process.env.API_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : "http://backend:8000");
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const API_URL = typeof window === "undefined" ? INTERNAL_API_URL : PUBLIC_API_URL;

export async function fetcher<T>(path: string): Promise<T> {
  const url = `${API_URL}${path}`;
  console.log(`[Fetcher] Requesting: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} for ${url}`);
  }
  return response.json() as Promise<T>;
}
