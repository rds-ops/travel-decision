"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  MessageCircle,
  Heart,
  User,
  Search,
  MoreHorizontal,
  Send,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type Reply = {
  id: string;
  author: string;
  handle: string;
  time: string;
  text: string;
  replies: Reply[];
  collapsed?: boolean;
};

type Post = {
  id: string;
  author: string;
  handle: string;
  time: string;
  text: string;
  likes: number;
  likedByMe: boolean;
  replies: Reply[];
};

const BG = "#0a0a0a";
const ACCENT = "#7FC7FF";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function timeNowLabel() {
  return "now";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-2 transition",
        active ? "text-white" : "text-white/65 hover:text-white"
      )}
      type="button"
    >
      <div
        className={cx(
          "grid place-items-center rounded-xl border transition",
          active
            ? "border-white/25 bg-white/10"
            : "border-transparent bg-transparent"
        )}
        style={{ width: 44, height: 44 }}
      >
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
}

function KeyHint() {
  return (
    <div className="mt-2 text-xs text-white/45">
      Enter отправляет, Shift+Enter перенос.
    </div>
  );
}

function ReplyNode({
  reply,
  depth,
  onReply,
  onToggleCollapse,
}: {
  reply: Reply;
  depth: number;
  onReply: (replyId: string, text: string) => void;
  onToggleCollapse: (replyId: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const hasChildren = (reply.replies?.length ?? 0) > 0;
  const collapsed = Boolean(reply.collapsed);

  return (
    <div className="relative">
      <div className="flex gap-3">
        <div className="mt-1 h-9 w-9 shrink-0 rounded-full bg-white/10" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-white">{reply.handle}</span>
            <span className="text-white/45">· {reply.time}</span>
            <div className="ml-auto">
              <button
                className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
                type="button"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="mt-1 whitespace-pre-wrap text-sm text-white/85">
            {reply.text}
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-white/55">
            {hasChildren && (
              <button
                onClick={() => onToggleCollapse(reply.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-white/5 hover:text-white"
                type="button"
              >
                {collapsed ? (
                  <ChevronRight size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
                {collapsed ? `Развернуть (${reply.replies.length})` : "Свернуть"}
              </button>
            )}

            <button
              className="rounded-lg px-2 py-1 hover:bg-white/5 hover:text-white"
              type="button"
              onClick={() => {
                // фокус на инпут - не делаем, чтобы не прыгало
              }}
            >
              Reply
            </button>
          </div>

          {/* Composer under each reply */}
          <div className="mt-2 flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ответить... (Enter отправляет)"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const t = draft.trim();
                  if (!t) return;
                  onReply(reply.id, t);
                  setDraft("");
                }
              }}
            />
            <button
              className="rounded-full px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              style={{ background: ACCENT }}
              type="button"
              onClick={() => {
                const t = draft.trim();
                if (!t) return;
                onReply(reply.id, t);
                setDraft("");
              }}
            >
              Reply
            </button>
          </div>

          {!collapsed && hasChildren && (
            <div className="mt-3 space-y-3">
              {reply.replies.map((child) => (
                <div
                  key={child.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  style={{ marginLeft: Math.min(depth + 1, 4) * 18 }}
                >
                  <ReplyNode
                    reply={child}
                    depth={depth + 1}
                    onReply={onReply}
                    onToggleCollapse={onToggleCollapse}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  const [active, setActive] = useState<
    "home" | "communities" | "messages" | "likes" | "profile"
  >("home");

  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");

  const [posts, setPosts] = useState<Post[]>([
    {
      id: uid(),
      author: "bali_nomad",
      handle: "bali_nomad",
      time: "2h",
      text: "Bali: Canggu. Wifi везде, еда дешёвая, закаты топ 🌊",
      likes: 12,
      likedByMe: false,
      replies: [
        {
          id: uid(),
          author: "you",
          handle: "you",
          time: "now",
          text: "ес",
          collapsed: false,
          replies: [
            {
              id: uid(),
              author: "you",
              handle: "you",
              time: "now",
              text: "ес",
              collapsed: false,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: uid(),
      author: "tokyo_weekender",
      handle: "tokyo_weekender",
      time: "4h",
      text: "Токио: лайфхак: Suica + Google Maps + не ходи в час пик 😅",
      likes: 31,
      likedByMe: false,
      replies: [],
    },
  ]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const hay = `${p.author} ${p.handle} ${p.text}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query]);

  function goSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function addPost() {
    const text = composer.trim();
    if (!text) return;
    const newPost: Post = {
      id: uid(),
      author: "you",
      handle: "you",
      time: timeNowLabel(),
      text,
      likes: 0,
      likedByMe: false,
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposer("");
  }

  function toggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.likedByMe;
        return {
          ...p,
          likedByMe: nextLiked,
          likes: Math.max(0, p.likes + (nextLiked ? 1 : -1)),
        };
      })
    );
  }

  function addReplyToPost(postId: string, text: string) {
    const t = text.trim();
    if (!t) return;

    const newReply: Reply = {
      id: uid(),
      author: "you",
      handle: "you",
      time: timeNowLabel(),
      text: t,
      collapsed: false,
      replies: [],
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
      )
    );
  }

  function addReplyToReply(postId: string, replyId: string, text: string) {
    const t = text.trim();
    if (!t) return;

    const newReply: Reply = {
      id: uid(),
      author: "you",
      handle: "you",
      time: timeNowLabel(),
      text: t,
      collapsed: false,
      replies: [],
    };

    function walk(list: Reply[]): Reply[] {
      return list.map((r) => {
        if (r.id === replyId) {
          return {
            ...r,
            replies: [...(r.replies || []), newReply],
            collapsed: false,
          };
        }
        return { ...r, replies: walk(r.replies || []) };
      });
    }

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: walk(p.replies) } : p))
    );
  }

  function toggleCollapseReply(postId: string, replyId: string) {
    function walk(list: Reply[]): Reply[] {
      return list.map((r) => {
        if (r.id === replyId) return { ...r, collapsed: !r.collapsed };
        return { ...r, replies: walk(r.replies || []) };
      });
    }

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: walk(p.replies) } : p))
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: BG }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="w-40 text-lg font-semibold tracking-tight">
            TravelThreads
          </div>

          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45"
              />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goSearch();
                }}
                placeholder="Поиск по постам (Enter = умный поиск)"
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-28 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
              />

              <button
                type="button"
                onClick={goSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-semibold text-black transition hover:opacity-90"
                style={{ background: ACCENT }}
              >
                Search
              </button>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <ActionButton
              icon={<Home size={20} />}
              label="Home"
              active={active === "home"}
              onClick={() => setActive("home")}
            />
            <ActionButton
              icon={<Users size={20} />}
              label="Сообщества"
              active={active === "communities"}
              onClick={() => setActive("communities")}
            />
            <ActionButton
              icon={<MessageCircle size={20} />}
              label="Messages"
              active={active === "messages"}
              onClick={() => setActive("messages")}
            />
            <ActionButton
              icon={<Heart size={20} />}
              label="Likes"
              active={active === "likes"}
              onClick={() => setActive("likes")}
            />
            <ActionButton
              icon={<User size={20} />}
              label="Profile"
              active={active === "profile"}
              onClick={() => setActive("profile")}
            />
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <div className="h-10 w-10 rounded-full bg-white/10" />
            <button
              className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
              type="button"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Single-column feed */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Composer */}
        <section
          id="composer"
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        >
          <div className="text-sm font-semibold text-white/85">Start a post</div>
          <div className="mt-3 flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
            <div className="flex-1">
              <textarea
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="Поделись тревел-лайфхаком..."
                maxLength={280}
                className="min-h-[92px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addPost();
                  }
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-white/45">{composer.length}/280</div>
                <button
                  onClick={addPost}
                  className="rounded-full px-6 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                  style={{ background: ACCENT }}
                  type="button"
                >
                  Post
                </button>
              </div>
              <KeyHint />
            </div>
          </div>
        </section>

        {/* Feed */}
        <section className="mt-6 space-y-4">
          {filteredPosts.map((p) => (
            <article
              key={p.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <div className="flex gap-3">
                <div className="mt-1 h-11 w-11 shrink-0 rounded-full bg-white/10" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{p.handle}</span>
                    <span className="text-sm text-white/45">· {p.time}</span>

                    <div className="ml-auto flex items-center gap-1">
                      <button
                        className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
                        type="button"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                    {p.text}
                  </div>

                  <div className="mt-4 flex items-center gap-5 text-sm text-white/60">
                    <button
                      onClick={() => toggleLike(p.id)}
                      className={cx(
                        "flex items-center gap-2 transition hover:text-white",
                        p.likedByMe ? "text-white" : "text-white/60"
                      )}
                      type="button"
                      aria-label="Like"
                    >
                      <Heart
                        size={18}
                        className={p.likedByMe ? "fill-white" : ""}
                      />
                      {p.likes}
                    </button>

                    <div className="flex items-center gap-2">
                      <MessageCircle size={18} />
                      {p.replies.length} replies
                    </div>

                    <button
                      className="flex items-center gap-2 hover:text-white"
                      type="button"
                    >
                      <Send size={18} />
                      Share
                    </button>
                  </div>

                  {/* Replies */}
                  <div className="mt-5 space-y-4">
                    {p.replies.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <ReplyNode
                          reply={r}
                          depth={0}
                          onReply={(replyId, text) =>
                            addReplyToReply(p.id, replyId, text)
                          }
                          onToggleCollapse={(replyId) =>
                            toggleCollapseReply(p.id, replyId)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {/* Reply to post */}
                  <ReplyToPost
                    onSend={(text) => addReplyToPost(p.id, text)}
                    accent={ACCENT}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function ReplyToPost({
  onSend,
  accent,
}: {
  onSend: (text: string) => void;
  accent: string;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Напиши ответ... (Enter отправляет)"
          className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const t = draft.trim();
              if (!t) return;
              onSend(t);
              setDraft("");
            }
          }}
        />
        <button
          className="rounded-full px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          style={{ background: accent }}
          type="button"
          onClick={() => {
            const t = draft.trim();
            if (!t) return;
            onSend(t);
            setDraft("");
          }}
        >
          Reply
        </button>
      </div>
      <div className="mt-2 text-xs text-white/45">
        Enter отправляет, Shift+Enter перенос.
      </div>
    </div>
  );
}
