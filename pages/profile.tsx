import Layout from "../components/Layout";

export default function Profile() {
  return (
    <Layout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Experience passport</h1>
          <p className="text-sm text-slate-600">Keep your travel context ready for every answer.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Helped answers", value: 3 },
            { label: "Cards sourced", value: 2 },
            { label: "Answer saves", value: 8 }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Saved cards</h2>
          <p className="mt-2 text-sm text-slate-600">No saved cards yet. Save cards to track them here.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Your activity</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>1 question asked</li>
            <li>2 answers posted</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
