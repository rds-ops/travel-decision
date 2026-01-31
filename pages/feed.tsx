import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

type FeedItem = {
  id: number;
  title: string;
  created_at: string;
  author?: { id: number; display_name?: string };
  last_message_at?: string | null;
};

type FeedProps = {
  items: FeedItem[];
};

export default function FeedPage({ items }: FeedProps) {
  return (
    <Layout>
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-ink">Feed</h1>
          <p className="text-sm text-slate-600">Latest public threads.</p>
        </div>

        <div className="space-y-3">
          <form
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            method="post"
            action="/api/create-thread"
          >
            <div className="text-sm font-semibold text-ink">Create a thread</div>

            <textarea
              name="question_text"
              className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-sm"
              rows={3}
              placeholder="Example: Where should I stay for a 2-month remote work stint?"
              required
            />

            <button
              type="submit"
              className="mt-3 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Post
            </button>
          </form>

          <div className="grid gap-3">
            {items.map((t) => (
              <Link
                key={t.id}
                href={`/questions/${t.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition-colors"
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

          {items.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No threads found. Be the first to post!
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await fetcher<{ items: FeedItem[] }>("/feed");
    return { props: { items: data.items ?? [] } };
  } catch (e: any) {
    console.error("Feed fetch failed:", e);
    return { props: { items: [] } };
  }
};
