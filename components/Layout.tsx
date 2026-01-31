import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-ink">
            Travel Decision
          </Link>

          <nav className="flex gap-4 text-sm text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/profile">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
