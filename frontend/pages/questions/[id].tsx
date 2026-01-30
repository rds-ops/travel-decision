import { GetServerSideProps } from "next";

import Layout from "../../components/Layout";
import { API_URL } from "../../lib/api";

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
  return (
    <Layout>
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-ink">{data.question.question_text}</h1>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
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
          <button className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm">
            Generate summary (draft)
          </button>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">Answers</h2>
          {data.answers.map((answer) => (
            <div key={answer.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-600">{answer.answer_text}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {Object.entries(answer.context || {}).map(([key, value]) => (
                  <span key={key} className="rounded-full bg-slate-100 px-2 py-1">
                    {key}: {value}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2 text-xs text-slate-500">
                <button className="rounded-full border border-slate-200 px-3 py-1">Helped</button>
                <button className="rounded-full border border-slate-200 px-3 py-1">Save</button>
                <button className="rounded-full border border-slate-200 px-3 py-1">Report</button>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Add your answer</h2>
          <form method="post" action="/api/create-answer">
            <input type="hidden" name="question_id" value={data.question.id} />
            {/* Optional email field for testing different users */}
            <input
              type="email"
              name="email"
              placeholder="Your email (optional, defaults to member@travel.dev)"
              className="mb-2 w-full rounded-lg border border-slate-200 p-2 text-xs"
            />
            <textarea
              name="answer_text"
              className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-sm"
              rows={4}
              placeholder="Share your experience..."
              required
            />
            <button type="submit" className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
              Post answer
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

import { fetcher } from "../../lib/api";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const questionId = params?.id;
  try {
    const questionData = await fetcher<QuestionDetail>(`/questions/${questionId}`);
    return { props: { data: questionData } };
  } catch (e) {
    console.error("Failed to fetch question:", e);
    return { notFound: true };
  }
};
