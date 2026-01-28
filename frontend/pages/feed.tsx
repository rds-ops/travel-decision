import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

type FeedItem = {
  id: number;
  title: string;
  created_at: string;
  author?: { id: number; display_name?: string };
  last_message_at?: string | null;
};

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${api}/feed?limit=20&offset=0`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => setItems(data.items || data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-ink">Feed</h1>
          <p className="text-sm text-slate-600">Latest public threads.</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            Loading…
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600 shadow-sm">
            Feed error: {error}
          </div>
        )}

        <div className="grid gap-3">
          {items.map((t) => (
            <Link
              key={t.id}
              href={`/questions/${t.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-ink">{t.title}</h3>
                <span className="text-xs text-slate-500">
                  {new Date(t.last_message_at || t.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                by {t.author?.display_name || "Unknown"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
