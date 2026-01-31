import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

type FeedItem = {
  id: number;
  title: string;
  created_at: string | null;
  last_message_at: string | null;
  author: { id: number; display_name: string };
};

type FeedProps = {
  items: FeedItem[];
};

export default function Home({ items }: FeedProps) {
  return (
    <Layout>
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-ink">Feed</h1>
          <p className="text-sm text-slate-600">Latest public threads and discussions.</p>
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

          {items.map((t) => (
            <Link
              key={t.id}
              href={`/questions/${t.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-ink">{t.title}</div>
                  <div className="mt-1 text-xs text-slate-500">by {t.author.display_name}</div>
                </div>

                <div className="shrink-0 text-right text-xs text-slate-500">
                  <div>Last: {t.last_message_at ? new Date(t.last_message_at).toLocaleString() : "—"}</div>
                </div>
              </div>
            </Link>
          ))}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Пока пусто. Создай первый тред сверху.
            </div>
          ) : null}
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
