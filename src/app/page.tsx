import Link from "next/link";
import { cookies } from "next/headers";

import { LockScreen } from "@/components/auth/lock-screen";
import { Dock } from "@/components/navigation/dock";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardContent } from "@/components/dashboard/content";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default function Home() {
  const hasSession = cookies().has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    return <LockScreen />;
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col pb-32">
      <AppShell className="gap-10 pb-24">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-[0.32em] text-foreground/50">Snipspace Workspace</p>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Daily capture timeline</h1>
            </div>
            <Link
              href="/docs/requirements"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-foreground/80 shadow-elevation-xs transition-transform duration-200 ease-mac hover:-translate-y-0.5 hover:shadow-elevation-sm"
            >
              Requirements
            </Link>
          </div>
          <p className="max-w-2xl text-sm text-foreground/65">
            Dock navigation, clipboard capture, and Supabase-backed search will populate the sections below as implementation progresses. This shell keeps the layout aligned while features land incrementally.
          </p>
        </header>
        <DashboardContent />
      </AppShell>
      <Dock />
    </main>
  );
}
