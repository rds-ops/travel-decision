import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api-client";

interface Answer {
  id: number;
  answer_text: string;
  context: Record<string, string>;
}

interface QuestionDetail {
  question: {
    id: number;
    question_text: string;
    duration: string;
    budget_tier: string;
    requirements: string[];
    status: string;
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

      if (!res.ok) {
        throw new Error(await res.text());
      }

      // Refresh the page data
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
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-ink">{data.question.question_text}</h1>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 uppercase tracking-wider">
              {data.question.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-1">{data.question.duration}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1">{data.question.budget_tier}</span>
            {data.question.requirements.map((req) => (
              <span key={req} className="rounded-full bg-slate-100 px-2 py-1">
                {req}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink pl-1">Answers</h2>
          {data.answers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-400">No answers yet. Share your experience!</p>
            </div>
          ) : (
            data.answers.map((answer) => (
              <div key={answer.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{answer.answer_text}</p>
                {answer.context && Object.keys(answer.context).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    {Object.entries(answer.context).map(([key, value]) => (
                      <span key={key} className="rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex gap-3 text-xs">
                  <button className="text-slate-400 hover:text-accent font-medium">Helpful</button>
                  <button className="text-slate-400 hover:text-accent font-medium">Save</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-ink mb-4">Add your answer</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="hidden" name="question_id" value={data.question.id} />
            <input
              type="email"
              name="email"
              placeholder="Email (optional, for attribution)"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
            />
            <textarea
              name="answer_text"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              rows={4}
              placeholder="Share advice, specific locations, or what to avoid..."
              required
            ></textarea>
            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto rounded-full bg-accent px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90 active:scale-95"
                }`}
            >
              {isSubmitting ? "Posting..." : "Post Answer"}
            </button>
          </form>
        </div>
      </section>
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
