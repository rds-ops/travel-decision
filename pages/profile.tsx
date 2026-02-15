import Layout from "../components/Layout";

export default function Profile() {
  return (
    <Layout>
      <section className="space-y-4">
        {/* Profile header card */}
        <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden">
          {/* Banner */}
          <div className="h-20 bg-gradient-to-r from-accent to-accent-blue" />

          <div className="p-4 -mt-8">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-card-light dark:bg-card-dark border-4 border-card-light dark:border-card-dark flex items-center justify-center">
              <svg
                width="40"
                height="40"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="text-muted-light dark:text-muted-dark"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="mt-2 text-xl font-bold text-ink dark:text-gray-100">
              u/traveler
            </h1>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Experience passport • Redditor since 2026
            </p>
          </div>
        </div>

        {/* Karma / stats */}
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Post Karma", value: 3, icon: "📝" },
            { label: "Comment Karma", value: 8, icon: "💬" },
            { label: "Cards Sourced", value: 2, icon: "🃏" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <div>
                  <p className="text-lg font-bold text-ink dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Saved cards */}
        <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
          <h2 className="text-base font-bold text-ink dark:text-gray-100">
            Saved Cards
          </h2>
          <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">
            No saved cards yet. Save cards to track them here.
          </p>
        </div>

        {/* Activity */}
        <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
          <h2 className="text-base font-bold text-ink dark:text-gray-100">
            Your Activity
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-muted-light dark:text-muted-dark">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              1 question asked
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-blue" />
              2 answers posted
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
