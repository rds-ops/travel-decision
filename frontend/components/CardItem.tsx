import Link from "next/link";

interface CardItemProps {
  id: number;
  title: string;
  summary: string;
  requirements: string[];
  budgetTier: string;
  duration: string;
}

export default function CardItem({
  id,
  title,
  summary,
  requirements,
  budgetTier,
  duration
}: CardItemProps) {
  return (
    <Link
      href={`/cards/${id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-accent"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {budgetTier}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{summary}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">{duration}</span>
        {requirements.map((req) => (
          <span key={req} className="rounded-full bg-slate-100 px-2 py-1">
            {req}
          </span>
        ))}
      </div>
    </Link>
  );
}
