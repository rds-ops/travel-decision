import { GetServerSideProps } from "next";
import Link from "next/link";

import Layout from "../components/Layout";

interface City {
  id: number;
  name: string;
  country: string;
}

interface HomeProps {
  cities: City[];
}

export default function Home({ cities }: HomeProps) {
  return (
    <Layout>
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-ink">
            Decide where to live for your next 1–3 month stay
          </h1>
          <p className="text-sm text-slate-600">
            Ask questions, read real experiences, and find scenario cards curated by moderators.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Quick scenario search</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-500">City</label>
              <select className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm">
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Duration</label>
              <select className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm">
                <option>1 month</option>
                <option>2 months</option>
                <option>3 months</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Budget</label>
              <select className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm">
                <option>low</option>
                <option>mid</option>
                <option>high</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Requirements</label>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                {["quiet", "safe", "good_internet", "central", "family_friendly"].map((req) => (
                  <span key={req} className="rounded-full border border-slate-200 px-2 py-1">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/search"
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Explore cards
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/cities/${city.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-base font-semibold text-ink">{city.name}</h3>
              <p className="text-xs text-slate-500">{city.country}</p>
              <p className="mt-2 text-sm text-slate-600">
                Explore curated topics for 1–3 month stays.
              </p>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // SSR выполняется внутри контейнера Next.js, поэтому localhost тут НЕ бэкенд.
  const apiUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://backend:8000";

  const res = await fetch(`${apiUrl}/cities`);
  if (!res.ok) {
    return { props: { cities: [] } };
  }

  const cities = await res.json();
  return { props: { cities } };
};
