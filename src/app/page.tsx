import { cookies } from "next/headers";

import { LockScreen } from "@/components/auth/lock-screen";
import { Dock } from "@/components/navigation/dock";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardContent } from "@/components/dashboard/content";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { fetchGroupedEntries } from "@/lib/data/entries";

export default async function Home() {
  const cookieStore = cookies();
  const hasSession = cookieStore.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    return <LockScreen />;
  }

  const groups = await fetchGroupedEntries();

  return (
    <main className="flex min-h-screen flex-1 flex-col pb-32">
      <AppShell className="gap-10 pb-24">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">Snipspace Workspace</p>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Daily capture timeline</h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm text-foreground/60">
            Dock navigation, clipboard capture, and Supabase-backed search will populate the sections below as implementation progresses. This shell keeps the layout aligned while features land incrementally.
          </p>
        </header>
        <DashboardContent groups={groups} />
      </AppShell>
      <Dock />
    </main>
  );
}
