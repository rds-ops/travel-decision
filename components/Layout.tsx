import Link from "next/link";
import { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-200">
      {/* ── Top navbar ────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 h-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-extrabold text-accent"
          >
            {/* Reddit-style icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="11" fill="currentColor" />
              <circle cx="8.5" cy="11" r="1.5" fill="white" />
              <circle cx="15.5" cy="11" r="1.5" fill="white" />
              <path
                d="M8 15c0 0 1.5 2 4 2s4-2 4-2"
                stroke="white"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">TravelDecision</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light dark:text-muted-dark"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search Travel Decision"
                className="w-full rounded-full border border-border-light dark:border-border-dark bg-hover-light dark:bg-hover-dark pl-9 pr-4 py-1.5 text-sm text-ink dark:text-gray-200 placeholder:text-muted-light dark:placeholder:text-muted-dark focus:border-accent-blue focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right icons */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="p-2 rounded hover:bg-hover-light dark:hover:bg-hover-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-gray-200 transition-colors"
              title="Home"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L2 9h3v8h4v-5h2v5h4V9h3L10 2z" />
              </svg>
            </Link>
            <Link
              href="/search"
              className="p-2 rounded hover:bg-hover-light dark:hover:bg-hover-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-gray-200 transition-colors"
              title="Search"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a5 5 0 104.906 6H8V3zM2 9a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 9z" />
              </svg>
            </Link>
            <Link
              href="/messages"
              className="p-2 rounded hover:bg-hover-light dark:hover:bg-hover-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-gray-200 transition-colors"
              title="Messages"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3H4a2 2 0 01-2-2V5z" />
              </svg>
            </Link>

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-hover-light dark:hover:bg-hover-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-gray-200 transition-colors"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <Link
              href="/profile"
              className="p-2 rounded hover:bg-hover-light dark:hover:bg-hover-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-gray-200 transition-colors"
              title="Profile"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main content ─────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-4">{children}</main>
    </div>
  );
}
