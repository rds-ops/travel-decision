// Один источник правды для API:
// 1) Если ты запускаешь Next внутри Docker -> API_URL будет из process.env.API_URL (http://backend:8000)
// 2) Если ты запускаешь Next локально (npm run dev) -> API_URL будет из NEXT_PUBLIC_API_URL или localhost

const INTERNAL_API_URL = process.env.API_URL || "http://backend:8000";
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
