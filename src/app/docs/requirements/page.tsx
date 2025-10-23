import fs from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";

function getRequirementsMarkdown() {
  const absolutePath = path.join(process.cwd(), "docs", "requirements.md");

  try {
    return fs.readFileSync(absolutePath, "utf-8");
  } catch (error) {
    console.error("Unable to load requirements document", error);
    return null;
  }
}

export default function RequirementsPage() {
  const markdown = getRequirementsMarkdown();

  if (!markdown) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <AppShell className="gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.24em] text-foreground/60">Documentation</p>
          <h1 className="text-3xl font-semibold text-foreground">Snipspace requirements</h1>
          <p className="text-sm text-foreground/70">
            Canonical feature and technical checklist mirrored from docs/requirements.md for easy in-app access.
          </p>
        </header>

        <article className="glass-panel max-w-none overflow-y-auto rounded-[32px] bg-surface/80 p-8 text-sm leading-relaxed text-foreground/80 shadow-elevation-sm backdrop-blur-glass">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
            {markdown}
          </pre>
        </article>
      </AppShell>
    </main>
  );
}
