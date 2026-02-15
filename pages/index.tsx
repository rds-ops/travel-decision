import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { fetcher } from "../lib/api-client";

type FeedItem = {
  id: number;
  title: string;
  created_at: string | null;
  last_message_at: string | null;
  author: { id: number; display_name: string };
  answer_count?: number;
  vote_score?: number;
};

type FeedProps = {
  items: FeedItem[];
};

export default function Home({ items }: FeedProps) {
  const router = useRouter();
  const [sort, setSort] = useState<"latest" | "hot">("latest");

  return (
    <Layout>
      {/* ── Sort tabs ─────────────────────────── */}
      <div className="mb-3 flex items-center gap-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-2">
        <button
          onClick={() => setSort("hot")}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${sort === "hot"
              ? "bg-hover-light dark:bg-hover-dark text-ink dark:text-gray-100"
              : "text-muted-light dark:text-muted-dark hover:bg-hover-light dark:hover:bg-hover-dark"
            }`}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
          </svg>
          Hot
        </button>
        <button
          onClick={() => setSort("latest")}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${sort === "latest"
              ? "bg-hover-light dark:bg-hover-dark text-ink dark:text-gray-100"
              : "text-muted-light dark:text-muted-dark hover:bg-hover-light dark:hover:bg-hover-dark"
            }`}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          New
        </button>
      </div>

      {/* ── Create post ────────────────────────── */}
      <form
        method="post"
        action="/api/create-thread"
        className="mb-3 flex items-center gap-3 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-2"
      >
        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-hover-light dark:bg-hover-dark border border-border-light dark:border-border-dark flex-shrink-0" />

        <input
          type="text"
          name="question_text"
          placeholder="Create Post"
          required
          className="flex-1 rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark px-3 py-1.5 text-sm text-ink dark:text-gray-200 placeholder:text-muted-light dark:placeholder:text-muted-dark focus:border-accent-blue focus:outline-none transition-colors"
        />

        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white hover:brightness-110 transition-all active:scale-95"
        >
          Post
        </button>
      </form>

      {/* ── Posts list ──────────────────────────── */}
      <div className="space-y-2">
        {items.map((item) => (
          <PostCard
            key={item.id}
            id={item.id}
            title={item.title}
            authorName={item.author.display_name}
            createdAt={item.created_at}
            lastMessageAt={item.last_message_at}
            answerCount={item.answer_count ?? 0}
            voteScore={item.vote_score ?? 0}
          />
        ))}

        {items.length === 0 && (
          <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8 text-center">
            <p className="text-muted-light dark:text-muted-dark text-sm">
              No posts yet. Be the first to create a thread!
            </p>
          </div>
        )}
      </div>
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
