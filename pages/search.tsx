import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import CardItem from "../components/CardItem";
import Layout from "../components/Layout";
import { fetcher } from "../lib/api-client";

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
      <section className="space-y-4">
        {/* Header */}
        <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
          <h1 className="text-xl font-bold text-ink dark:text-gray-100">
            Scenario Search
          </h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            Filter experience cards by city, topic, budget, and stay duration.
          </p>
        </div>

        {/* Filters */}
        <form
          className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            const params = new URLSearchParams();
            data.forEach((value, key) => {
              if (value) params.set(key, value.toString());
            });
            router.push(`/search?${params.toString()}`);
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wide">
                City
              </label>
              <select
                name="city_id"
                className="mt-1 w-full rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark p-2 text-sm text-ink dark:text-gray-200"
              >
                <option value="">All cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wide">
                Topic
              </label>
              <select
                name="topic_id"
                className="mt-1 w-full rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark p-2 text-sm text-ink dark:text-gray-200"
              >
                <option value="">All topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wide">
                Budget tier
              </label>
              <select
                name="budget_tier"
                className="mt-1 w-full rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark p-2 text-sm text-ink dark:text-gray-200"
              >
                <option value="">Any</option>
                <option value="low">Low</option>
                <option value="mid">Mid</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wide">
                Requirements (comma separated)
              </label>
              <input
                name="requirements"
                className="mt-1 w-full rounded-md border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark p-2 text-sm text-ink dark:text-gray-200 placeholder:text-muted-light dark:placeholder:text-muted-dark"
                placeholder="quiet, safe, good_internet"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-4 py-2 text-sm font-bold text-white hover:brightness-110 transition-all active:scale-95"
              >
                Filter
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="grid gap-3">
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
          {cards.length === 0 && (
            <div className="rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8 text-center text-sm text-muted-light dark:text-muted-dark">
              No cards match your filters.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params = new URLSearchParams();
  const keys = ["city_id", "topic_id", "budget_tier", "requirements"];

  keys.forEach((key) => {
    const value = query[key];
    if (value && value !== "") params.set(key, value.toString());
  });

  try {
    const [cards, cities, topics] = await Promise.all([
      fetcher<Card[]>(`/search/cards?${params.toString()}`),
      fetcher<City[]>("/cities"),
      fetcher<Topic[]>("/topics"),
    ]);
    return { props: { cards, cities, topics } };
  } catch (error: any) {
    console.error("Failed to fetch search data:", error);
    return { props: { cards: [], cities: [], topics: [] } };
  }
};
