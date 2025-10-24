"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clapperboard, Image as ImageIcon, Link as LinkIcon, Loader2, Plus, TextQuote } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_LIMIT } from "@/lib/constants";
import type { EntryType } from "@/lib/data/fixtures";

const TYPE_ICONS: Record<EntryType, JSX.Element> = {
  text: <TextQuote className="h-4 w-4" />,
  link: <LinkIcon className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  video: <Clapperboard className="h-4 w-4" />,
  snippet: <TextQuote className="h-4 w-4" />,
  mixed: <Plus className="h-4 w-4" />,
};

interface DraftEntry {
  raw: string;
  title: string;
  type: EntryType;
  imageFile?: File | null;
}

const initialDraft: DraftEntry = {
  raw: "",
  title: "",
  type: "text",
  imageFile: null,
};

function detectEntryType(value: string): EntryType {
  const trimmed = value.trim();
  if (!trimmed) return "text";
  const isUrl = /^https?:\/\/\S+/i.test(trimmed);
  if (isUrl) {
    const isVideo = /(youtube\.com|youtu\.be|vimeo\.com|bilibili\.com)/i.test(trimmed);
    return isVideo ? "video" : "link";
  }
  if (/```[\s\S]*```/.test(trimmed)) {
    return "snippet";
  }
  if (trimmed.length > 280) {
    return "mixed";
  }
  return "text";
}

export function CaptureEntryTrigger() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftEntry>(initialDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setDraft(initialDraft);
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (!file) continue;
        if (file.size > IMAGE_LIMIT) {
          setError("图片超过 10MB，粘贴前请压缩");
          setDraft((prev) => ({ ...prev, type: "image", imageFile: null }));
          return;
        }
        setDraft((prev) => ({ ...prev, type: "image", imageFile: file, raw: prev.raw }));
        setError(null);
        return;
      }
    }
  }, []);

  const handleContentChange = useCallback((value: string) => {
    setDraft((prev) => ({ ...prev, raw: value, type: detectEntryType(value) }));
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > IMAGE_LIMIT) {
      setError("图片超过 10MB，请先压缩后再上传");
      return;
    }
    setDraft((prev) => ({ ...prev, type: "image", imageFile: file }));
    setError(null);
  }, []);

  const previewMeta = useMemo(() => {
    if (draft.type === "image" && draft.imageFile) {
      return `${draft.imageFile.name} · ${(draft.imageFile.size / 1024).toFixed(0)} KB`;
    }
    if (draft.type === "link") {
      return "将尝试抓取链接标题和封面";
    }
    if (draft.type === "video") {
      return "将保存视频地址并生成平台预览";
    }
    if (draft.type === "snippet") {
      return "检测到代码片段，稍后可选择语法高亮";
    }
    return "默认保存为文本，可在提交前调整类型";
  }, [draft]);

  const submitDraft = useCallback(async () => {
    if (!draft.raw && !draft.imageFile) {
      setError("请输入内容或粘贴图片");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("type", draft.type);
    formData.append("content", draft.raw ?? "");
    if (draft.title) {
      formData.append("title", draft.title);
    }
    if (draft.imageFile) {
      formData.append("image", draft.imageFile);
    }
    const trimmed = draft.raw.trim();
    if ((draft.type === "link" || draft.type === "video") && /^https?:\/\//i.test(trimmed)) {
      formData.append("sourceUrl", trimmed);
    }

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = data?.message ?? "暂存失败，请稍后重试";
        setError(message);
        toast.error("保存失败", { description: message });
        return;
      }

      toast.success("已保存剪藏", {
        description: "稍后将在时间线中看到最新条目",
      });
      setOpen(false);
      setDraft(initialDraft);
      router.refresh();
    } catch (err) {
      console.error(err);
      const message = "请求失败，请检查网络或 Supabase 配置";
      setError(message);
      toast.error("保存失败", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="group fixed bottom-28 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-elevation-md transition-transform duration-200 ease-mac hover:-translate-y-1"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">打开新建剪藏面板</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[36px] border border-white/20 bg-white/70 p-0 text-foreground shadow-elevation-md backdrop-blur-[30px] sm:p-0">
        <DialogHeader className="space-y-2 border-b border-white/20 bg-white/20 px-8 py-6">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {TYPE_ICONS[draft.type]}
            <span>新建剪藏</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/65">
            支持直接粘贴文字、URL、图片等内容。图片需在 10MB 内，超出后会提示压缩。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 px-8 py-6">
          <div className="space-y-2">
            <Label htmlFor="entry-title">标题（可选）</Label>
            <Input
              id="entry-title"
              placeholder="例如：macOS 设计灵感"
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="entry-content">内容</Label>
              <span className="text-xs text-foreground/50">自动识别类型：{draft.type}</span>
            </div>
            <Textarea
              id="entry-content"
              placeholder="粘贴文本、链接或键入笔记"
              rows={5}
              value={draft.raw}
              onChange={(event) => handleContentChange(event.target.value)}
              onPaste={handlePaste}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/16 bg-white/10 px-4 py-3 text-xs text-foreground/70">
            <span>{previewMeta}</span>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="entry-image"
                className="cursor-pointer rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                选择图片
              </Label>
              <input id="entry-image" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter className="flex items-center justify-end gap-3 border-t border-white/20 bg-white/30 px-8 py-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button onClick={submitDraft} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 保存中
              </>
            ) : (
              "保存"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
