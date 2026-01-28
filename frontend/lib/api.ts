// Один источник правды для API:
// 1) Если ты запускаешь Next внутри Docker -> API_URL будет из process.env.API_URL (http://backend:8000)
// 2) Если ты запускаешь Next локально (npm run dev) -> API_URL будет из NEXT_PUBLIC_API_URL или localhost

const INTERNAL_API_URL = process.env.API_URL || "http://backend:8000";
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Важно: когда Next запущен локально, INTERNAL_API_URL "http://backend:8000" не работает.
// Поэтому для SSR тоже используем PUBLIC_API_URL, если INTERNAL указывает на backend и мы не в Docker.
function resolveServerApiUrl() {
  // если явно передали API_URL и он не "backend" — используем его
  if (process.env.API_URL && !process.env.API_URL.includes("backend")) return process.env.API_URL;

  // если API_URL не задан или равен backend:8000 — используем публичный
  return PUBLIC_API_URL;
}

export const API_URL = typeof window === "undefined" ? resolveServerApiUrl() : PUBLIC_API_URL;

export async function fetcher<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
