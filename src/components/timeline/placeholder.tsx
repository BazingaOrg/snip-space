import Link from "next/link";

import type { GroupedEntries } from "@/lib/data/fixtures";

function EntryCard({
  title,
  content,
  type,
  sourceUrl,
}: {
  title?: string;
  content: string;
  type: string;
  sourceUrl?: string;
}) {
  return (
    <article className="group rounded-2xl border border-white/16 bg-white/8 p-4 shadow-elevation-xs transition-all duration-200 ease-mac hover:border-white/30 hover:bg-white/12">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-foreground/55">
          {type}
        </span>
        {sourceUrl ? (
          <Link
            href={sourceUrl}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            target="_blank"
            rel="noreferrer"
          >
            打开链接
          </Link>
        ) : null}
      </div>
      {title ? <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3> : null}
      <p className="mt-2 text-sm text-foreground/75 line-clamp-3">{content}</p>
    </article>
  );
}

export function TimelinePlaceholder({ groups }: { groups: GroupedEntries[] }) {
  if (groups.length === 0) {
    return (
      <section className="glass-panel flex flex-col gap-4 rounded-[32px] p-8 text-sm text-foreground/70 shadow-elevation-sm">
        <h3 className="text-base font-semibold text-foreground">暂无剪藏</h3>
        <p>点击右下角的 + 按钮或直接粘贴内容，即可创建第一条笔记。</p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="glass-panel flex flex-col gap-6 rounded-[32px] p-6 shadow-elevation-sm">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Timeline</p>
            <h2 className="text-xl font-semibold text-foreground">Recent captures</h2>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-foreground/60">
            Types filter TBD
          </span>
        </header>
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.day} className="rounded-2xl border border-white/12 bg-white/8 p-4 shadow-elevation-xs">
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">{group.day}</p>
              <div className="mt-4 grid gap-3">
                {group.entries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    title={entry.title}
                    content={entry.content}
                    type={entry.type}
                    sourceUrl={entry.sourceUrl}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="glass-panel flex flex-col gap-4 rounded-[32px] p-6 shadow-elevation-sm">
        <h3 className="text-lg font-semibold text-foreground">Entry detail</h3>
        <p className="text-sm text-foreground/70">
          Selecting an item from the timeline will populate this panel with metadata, quick actions, and preview.
        </p>
        <div className="rounded-2xl border border-white/18 bg-white/8 p-4 text-xs text-foreground/60">
          Placeholder for pinned notes, quick tags, and toast notifications hooking into the right-top stack.
        </div>
        <Link
          href="/docs/requirements"
          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary"
        >
          查看完整需求文档 →
        </Link>
      </aside>
    </section>
  );
}
