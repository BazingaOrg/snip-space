"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { verifyAccessAction, type VerifyAccessState } from "@/app/_actions/verify-access";
import { cn } from "@/lib/utils";

const INITIAL_STATE: VerifyAccessState = { status: "idle" };

function formatTime(date: Date) {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevation-xs transition-transform duration-200 ease-mac hover:-translate-y-0.5 hover:shadow-elevation-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
      aria-label="解锁"
      disabled={pending}
    >
      <span className="text-lg">⏎</span>
    </button>
  );
}

export function LockScreen() {
  const [now, setNow] = useState(() => new Date());
  const [state, formAction] = useFormState(verifyAccessAction, INITIAL_STATE);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(() => formatTime(now), [now]);
  const formattedDate = useMemo(() => formatDate(now), [now]);

  const hasError = state.status === "error";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-aurora)] opacity-75" />

      <div className="relative flex w-full max-w-lg flex-col items-center gap-8 rounded-[48px] border border-border/60 bg-surface/95 px-12 py-16 text-center text-foreground shadow-elevation-md backdrop-blur-[38px] supports-[backdrop-filter]:bg-surface/70">
        <div className="absolute inset-x-8 top-8 h-1 rounded-full bg-subtle/80 supports-[backdrop-filter]:bg-subtle/60" />
        <div className="flex flex-col items-center gap-1 pt-6 text-foreground">
          <span className="text-6xl font-semibold tracking-tight sm:text-7xl">{formattedTime}</span>
          <span className="text-base font-medium text-foreground/70 sm:text-lg">{formattedDate}</span>
        </div>

        <form
          action={formAction}
          className={cn(
            "flex w-full max-w-sm flex-col items-center gap-5 rounded-[32px] border border-border/60 bg-surface/95 px-8 py-8 text-foreground shadow-elevation-sm supports-[backdrop-filter]:bg-surface/70",
            hasError && "animate-shake border-destructive/40",
          )}
        >
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm font-medium tracking-[0.32em] text-foreground/70">输入访问密码</p>
            <p className="text-xs text-foreground/55">本会话有效，关闭标签页后需重新解锁</p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-full border border-border/60 bg-subtle/80 px-4 py-2 focus-within:border-primary/45 focus-within:shadow-elevation-xs supports-[backdrop-filter]:bg-subtle/60">
            <input
              type="password"
              name="password"
              placeholder="••••••"
              autoComplete="current-password"
              className="w-full bg-transparent text-center text-sm text-foreground outline-none placeholder:text-foreground/35"
              aria-label="访问密码"
              required
            />
            <SubmitButton />
          </div>

          {hasError ? (
            <p className="text-xs text-destructive">{state.message}</p>
          ) : (
            <p className="text-xs text-foreground/45">按 Enter 提交或点击按钮解锁</p>
          )}
        </form>
      </div>
    </main>
  );
}
