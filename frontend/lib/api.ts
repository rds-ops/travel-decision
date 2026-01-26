const INTERNAL_API_URL = process.env.API_URL || "http://backend:8000";
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// SSR (в контейнере) ходит на backend:8000
// Браузер ходит на localhost:8000
export const API_URL = typeof window === "undefined" ? INTERNAL_API_URL : PUBLIC_API_URL;

export async function fetcher<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
