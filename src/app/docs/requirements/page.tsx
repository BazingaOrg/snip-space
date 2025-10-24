import fs from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";

function getRequirementsMarkdown() {
  const absolutePath = path.join(process.cwd(), "docs", "requirements.md");

  try {
    return fs.readFileSync(absolutePath, "utf-8");
  } catch (error) {
    console.error("无法加载需求文档", error);
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
      <section className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-12 sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/18 bg-glass shadow-elevation-md backdrop-blur-[40px]" />
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/55 via-white/18 to-white/6" />
        <div className="relative flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
          <header className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">文档</p>
            <h1 className="text-3xl font-semibold text-foreground">Snipspace 需求清单</h1>
            <p className="text-sm text-foreground/65">此页面镜像 docs/requirements.md，便于在应用内快速查看产品与技术需求。</p>
          </header>

          <article className="glass-panel max-w-none flex-1 overflow-y-auto rounded-[32px] bg-surface/85 p-8 text-sm leading-relaxed text-foreground/80 shadow-elevation-sm backdrop-blur-glass">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{markdown}</pre>
          </article>
        </div>
      </section>
    </main>
  );
}
