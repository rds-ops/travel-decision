import Layout from "../components/Layout";

export default function Admin() {
  return (
    <Layout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Admin panel</h1>
          <p className="text-sm text-slate-600">Moderate reports, edit card drafts, and manage questions.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-ink">Reports queue</h2>
            <p className="mt-2 text-sm text-slate-600">No new reports. Check back later.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-ink">Card drafts</h2>
            <p className="mt-2 text-sm text-slate-600">Review draft cards generated from Q&A threads.</p>
            <button className="mt-3 rounded-full border border-slate-200 px-4 py-2 text-sm">
              Open drafts
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Question pipeline</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>OPEN: 4 questions</li>
            <li>COMPILING_SUMMARY: 1 question</li>
            <li>RESOLVED: 8 questions</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
