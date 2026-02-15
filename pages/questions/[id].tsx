import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import VoteButton from "../../components/VoteButton";
import CommentCard from "../../components/CommentCard";
import TimeAgo from "../../components/TimeAgo";
import { fetcher } from "../../lib/api-client";

interface Answer {
  id: number;
  answer_text: string;
  context: Record<string, string>;
  created_at?: string;
}

interface QuestionDetail {
  question: {
    id: number;
    question_text: string;
    duration: string;
    budget_tier: string;
    requirements: string[];
    status: string;
    created_at?: string;
  };
  answers: Answer[];
}

interface QuestionPageProps {
  data: QuestionDetail;
}

export default function QuestionPage({ data }: QuestionPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const body = {
      question_id: formData.get("question_id"),
      answer_text: formData.get("answer_text"),
      email: formData.get("email"),
    };

    try {
      const res = await fetch("/api/create-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      router.replace(router.asPath);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* ── Thread header ─────────────────────── */}
      <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
        <div className="flex">
          {/* Vote column */}
          <div className="flex items-start justify-center w-10 pt-3 bg-hover-light dark:bg-hover-dark rounded-l-md">
            <VoteButton initialScore={0} />
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            {/* Meta */}
            <div className="flex items-center gap-1 text-xs text-muted-light dark:text-muted-dark">
              <span>Posted by u/traveler</span>
              <span>•</span>
              <TimeAgo date={data.question.created_at} />
            </div>

            {/* Title */}
            <h1 className="mt-2 text-xl font-bold text-ink dark:text-gray-100 leading-snug">
              {data.question.question_text}
            </h1>

            {/* Tags / Flair */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
                {data.question.status}
              </span>
              <span className="rounded-full bg-hover-light dark:bg-hover-dark border border-border-light dark:border-border-dark px-2.5 py-0.5 text-xs text-muted-light dark:text-muted-dark">
                {data.question.duration}
              </span>
              <span className="rounded-full bg-hover-light dark:bg-hover-dark border border-border-light dark:border-border-dark px-2.5 py-0.5 text-xs text-muted-light dark:text-muted-dark">
                {data.question.budget_tier}
              </span>
              {data.question.requirements.map((req) => (
                <span
                  key={req}
                  className="rounded-full bg-hover-light dark:bg-hover-dark border border-border-light dark:border-border-dark px-2.5 py-0.5 text-xs text-muted-light dark:text-muted-dark"
                >
                  {req}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2 text-xs font-bold text-muted-light dark:text-muted-dark border-t border-border-light dark:border-border-dark pt-2">
              <span className="flex items-center gap-1 hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3H4a2 2 0 01-2-2V5z" />
                </svg>
                {data.answers.length} {data.answers.length === 1 ? "Comment" : "Comments"}
              </span>
              <span className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors cursor-pointer">
                Share
              </span>
              <span className="hover:bg-hover-light dark:hover:bg-hover-dark px-2 py-1 rounded-sm transition-colors cursor-pointer">
                Save
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reply box ─────────────────────────── */}
      <div className="mt-3 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
        <p className="text-xs text-muted-light dark:text-muted-dark mb-2">
          Comment as <span className="text-accent-blue font-medium">traveler</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="question_id" value={data.question.id} />
          <input
            type="email"
            name="email"
            placeholder="Email (optional, for attribution)"
            className="w-full rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark px-3 py-2 text-sm text-ink dark:text-gray-200 placeholder:text-muted-light dark:placeholder:text-muted-dark focus:border-accent-blue focus:outline-none transition-colors"
          />
          <textarea
            name="answer_text"
            rows={4}
            placeholder="What are your thoughts?"
            required
            className="w-full rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark px-3 py-2 text-sm text-ink dark:text-gray-200 placeholder:text-muted-light dark:placeholder:text-muted-dark focus:border-accent-blue focus:outline-none transition-colors resize-y"
          />
          {error && (
            <p className="text-xs font-medium text-red-500">{error}</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-full bg-accent px-6 py-1.5 text-sm font-bold text-white transition-all ${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:brightness-110 active:scale-95"
                }`}
            >
              {isSubmitting ? "Posting..." : "Comment"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Answers / Comments ────────────────── */}
      <div className="mt-3 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
        {data.answers.length === 0 ? (
          <p className="text-center text-sm text-muted-light dark:text-muted-dark py-6">
            No comments yet. Share your experience!
          </p>
        ) : (
          <div className="space-y-4">
            {data.answers.map((answer) => (
              <CommentCard
                key={answer.id}
                id={answer.id}
                text={answer.answer_text}
                context={answer.context}
                createdAt={answer.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const questionId = params?.id;
  try {
    const data = await fetcher<QuestionDetail>(`/questions/${questionId}`);
    return { props: { data } };
  } catch (e) {
    console.error("Failed to fetch question:", e);
    return { notFound: true };
  }
};
