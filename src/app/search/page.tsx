"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowLeft, Sparkles, ExternalLink } from "lucide-react";

const BG = "#0a0a0a";
const ACCENT = "#7FC7FF";

type Post = {
  id: string;
  handle: string;
  time: string;
  text: string;
  tags?: string[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function scoreMatch(query: string, text: string) {
  const q = normalize(query);
  const t = normalize(text);
  if (!q) return 0;
  if (t.includes(q)) return 100;

  // простая "дешевая семантика": разбиваем на слова и считаем совпадения
  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const w of words) {
    if (w.length < 2) continue;
    if (t.includes(w)) score += 12;
  }
  return score;
}

function cheapSummary(q: string, matched: Post[]) {
  const query = q.trim();
  if (!query) return "Введи запрос, и я соберу выжимку + посты.";

  // соберем "темы" из примитивных эвристик
  const qq = normalize(query);
  const hints: string[] = [];

  if (/(виза|visa|визаран)/.test(qq)) hints.push("Похоже, вопрос про визы/въезд.");
  if (/(отель|hotel|hilton)/.test(qq)) hints.push("Похоже, вопрос про жилье/отели и цены.");
  if (/(авиалини|airways|рейс|багаж|перелет)/.test(qq))
    hints.push("Похоже, вопрос про перелет/авиакомпанию.");
  if (/(сим|карта|банк|обмен|налич)/.test(qq))
    hints.push("Похоже, вопрос про деньги/банки/обмен.");

  const base =
    matched.length > 0
      ? `Нашла ${matched.length} пост(ов) по запросу.`
      : `Пока ничего прямого не нашла в демо-постах, но могу подсказать, как уточнить запрос.`;

  const tips =
    matched.length > 0
      ? "Открой топовые посты ниже, а потом уточни запрос через фильтры-чипы."
      : "Попробуй добавить: страна/город, период, гражданство, бренд (например: “виза индонезия узбекистан”, “hilton sharm price”).";

  const hintLine = hints.length ? `\n${hints.join(" ")}` : "";

  return `${base}${hintLine}\n${tips}`;
}

export default function SearchPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";

  const [q, setQ] = useState(initialQ);

  // демо-данные. позже заменишь на API/fetch
  const [posts] = useState<Post[]>([
    {
      id: uid(),
      handle: "bali_nomad",
      time: "2h",
      text: "Bali: Canggu. Wifi везде, еда дешёвая, закаты топ 🌊",
      tags: ["location:bali", "wifi:good", "budget:low"],
    },
    {
      id: uid(),
      handle: "tokyo_weekender",
      time: "4h",
      text: "Токио: лайфхак: Suica + Google Maps + не ходи в час пик 😅",
      tags: ["location:tokyo", "transport:suica"],
    },
    {
      id: uid(),
      handle: "visa_helper",
      time: "1d",
      text: "Индонезия: для граждан Узбекистана часто спрашивают обратный билет + бронь отеля. Уточняй тип визы: VOA / e-VOA / KITAS.",
      tags: ["topic:visa", "country:indonesia", "citizenship:uzbekistan"],
    },
    {
      id: uid(),
      handle: "sharm_traveler",
      time: "3d",
      text: "Шарм-эль-Шейх: Hilton Sharks Bay обычно дороже в сезон. Смотри цену на конкретные даты, потому что разброс адский.",
      tags: ["topic:hotel", "brand:hilton", "location:sharm"],
    },
    {
      id: uid(),
      handle: "aviageek_uz",
      time: "5d",
      text: "Uzbekistan Airways: по отзывам норм сервис, но бывают задержки. Всегда проверяй нормы багажа в билете и на сайте перевозчика.",
      tags: ["topic:airline", "brand:uzbekistan-airways"],
    },
  ]);

  const matched = useMemo(() => {
    const query = q.trim();
    if (!query) return [];

    const scored = posts
      .map((p) => ({
        p,
        score:
          scoreMatch(query, `${p.handle} ${p.text} ${(p.tags ?? []).join(" ")}`) +
          // маленький буст за совпадения в тегах
          scoreMatch(query, (p.tags ?? []).join(" ")),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);

    return scored;
  }, [q, posts]);

  const summary = useMemo(() => cheapSummary(q, matched), [q, matched]);

  // "умные чипы" - пока на эвристиках и по найденным тегам
  const chips = useMemo(() => {
    const set = new Set<string>();

    // чипы из запроса
    const qq = normalize(q);
    if (/(виза|visa)/.test(qq)) set.add("topic:visa");
    if (/(отель|hotel|hilton)/.test(qq)) set.add("topic:hotel");
    if (/(airways|авиалини|рейс|багаж)/.test(qq)) set.add("topic:airline");

    // чипы из совпавших постов
    for (const p of matched.slice(0, 6)) {
      for (const t of p.tags ?? []) set.add(t);
    }

    // ограничим, чтобы не превратилось в свалку
    return Array.from(set).slice(0, 10);
  }, [q, matched]);

  function applyChip(tag: string) {
    const next = q.trim() ? `${q.trim()} ${tag}` : tag;
    setQ(next);
    router.push(`/search?q=${encodeURIComponent(next)}`);
  }

  function runSearch() {
    const next = q.trim();
    router.push(`/search?q=${encodeURIComponent(next)}`);
  }

  return (
    <div className="min-h-screen text-white" style={{ background: BG }}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="font-semibold">Search</div>

          <div className="ml-auto text-xs text-white/45">
            /search?q=...
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              placeholder="Спроси как человек: “виза узбекистанцам в индонезию”, “hilton sharm price”, “отзывы uzbekistan airways”"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-28 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
            />

            <button
              type="button"
              onClick={runSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              style={{ background: ACCENT }}
            >
              Search
            </button>
          </div>

          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => applyChip(c)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70 hover:bg-white/5 hover:text-white"
                  title="Добавить в запрос"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        {/* Summary card */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Sparkles size={16} style={{ color: ACCENT }} />
            Выжимка
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-white/75">
            {summary}
          </div>

          <div className="mt-3 text-xs text-white/45">
            Сейчас это демо-резюме (дешёвые эвристики). Дальше подключим нормальную
            “агрегацию” без превращения в ChatGPT.
          </div>
        </section>

        {/* Results */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/85">
              Посты по запросу
            </div>
            <div className="text-xs text-white/45">
              найдено: {matched.length}
            </div>
          </div>

          {matched.length ? (
            matched.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white">{p.handle}</div>
                    <div className="text-xs text-white/45">{p.time}</div>
                  </div>

                  <button
                    type="button"
                    className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                    onClick={() => {
                      // потом сделаем deep link на пост
                      navigator.clipboard?.writeText(
                        `${window.location.href}#post-${p.id}`
                      );
                    }}
                    title="Скопировать ссылку (пока демо)"
                  >
                    <ExternalLink size={14} />
                    Copy
                  </button>
                </div>

                <div className="mt-3 whitespace-pre-wrap text-sm text-white/85">
                  {p.text}
                </div>

                {!!(p.tags?.length) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags!.slice(0, 8).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
              Ничего не нашли. Уточни запрос (страна/город/бренд/гражданство) или
              ткни чип сверху.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
