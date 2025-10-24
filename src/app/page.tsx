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
    <main className="flex min-h-screen flex-col gap-10 px-4 py-14 pb-32 sm:px-10 sm:py-16 lg:px-12">
      <DashboardContent groups={groups} />
      <Dock />
    </main>
  );
}
