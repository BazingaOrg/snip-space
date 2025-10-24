import { cookies } from "next/headers";

import { LockScreen } from "@/components/auth/lock-screen";
import { Dock } from "@/components/navigation/dock";
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
      <section className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-4 py-14 pb-24 sm:gap-10 sm:px-10 sm:py-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 rounded-[40px] border border-white/18 bg-glass shadow-elevation-md backdrop-blur-[48px]" />
        <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/55 via-white/20 to-white/6" />
        <div className="relative flex flex-1 flex-col gap-10 px-4 py-6 sm:px-10 sm:py-12">
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
        </div>
      </section>
      <Dock />
    </main>
  );
}
