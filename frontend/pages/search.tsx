import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import CardItem from "../components/CardItem";
import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

interface Card {
  id: number;
  title: string;
  summary: string;
  requirements: string[];
  budget_tier: string;
  duration: string;
}

interface City {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
}

interface SearchProps {
  cards: Card[];
  cities: City[];
  topics: Topic[];
}

export default function Search({ cards, cities, topics }: SearchProps) {
  const router = useRouter();

  return (
    <Layout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Scenario search</h1>
          <p className="text-sm text-slate-600">
            Filter experience cards by city, topic, budget, and stay duration.
          </p>
        </div>
        <form
          className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            const params = new URLSearchParams();
            data.forEach((value, key) => {
              if (value) {
                params.set(key, value.toString());
              }
            });
            router.push(`/search?${params.toString()}`);
          }}
        >
          <div>
            <label className="text-xs text-slate-500">City</label>
            <select name="city_id" className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm">
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Topic</label>
            <select name="topic_id" className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm">
              <option value="">All topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Budget tier</label>
            <select name="budget_tier" className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm">
              <option value="">Any</option>
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Requirements (comma separated)</label>
            <input
              name="requirements"
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="quiet, safe, good_internet"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
              Filter
            </button>
          </div>
        </form>
        <div className="grid gap-4">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              id={card.id}
              title={card.title}
              summary={card.summary}
              requirements={card.requirements}
              budgetTier={card.budget_tier}
              duration={card.duration}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params = new URLSearchParams();
  const keys = ["city_id", "topic_id", "budget_tier", "requirements"];

  keys.forEach(key => {
    const value = query[key];
    if (value && value !== "") {
      params.set(key, value.toString());
    }
  });

  const [cards, cities, topics] = await Promise.all([
    fetcher<Card[]>(`/search/cards?${params.toString()}`),
    fetcher<City[]>("/cities"),
    fetcher<Topic[]>("/topics")
  ]);
  return { props: { cards, cities, topics } };
};
