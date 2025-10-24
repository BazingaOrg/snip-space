 "use client";
 
import { useCallback, useState, type ClipboardEvent, type DragEvent } from "react";
 import { useRouter } from "next/navigation";
 import { toast } from "sonner";
import { Clapperboard, Image as ImageIcon, Link as LinkIcon, Loader2, NotebookPen, TextQuote, UploadCloud } from "lucide-react";
 
import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { IMAGE_LIMIT } from "@/lib/constants";
 import type { EntryType } from "@/lib/data/fixtures";
 
const TYPE_ICONS: Record<EntryType, JSX.Element> = {
  text: <TextQuote className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
  video: <Clapperboard className="h-5 w-5" />,
  snippet: <TextQuote className="h-5 w-5" />,
  mixed: <NotebookPen className="h-5 w-5" />,
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
 
export function CaptureEntryPanel() {
  const [draft, setDraft] = useState<DraftEntry>(initialDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
 
  const handlePaste = useCallback((event: ClipboardEvent<HTMLTextAreaElement>) => {
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
    setDraft((prev) => ({ ...prev, raw: value }));
  }, []);
 
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    if (file.size > IMAGE_LIMIT) {
      setError("图片超过 10MB，请先压缩后再上传");
      return;
    }
    setDraft((prev) => ({ ...prev, type: "image", imageFile: file }));
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      handleFileSelect(file ?? null);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);
 
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
      setDraft(initialDraft);
      setError(null);
      setIsSubmitting(false);
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
    <section className="flex flex-col gap-8 rounded-3xl border border-border/60 bg-surface/95 px-6 py-8 text-sm text-foreground/80 shadow-elevation-sm backdrop-blur-[18px] supports-[backdrop-filter]:bg-surface/70 sm:px-10 sm:py-10">
      <header className="flex flex-wrap items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          {TYPE_ICONS[draft.type]}
        </span>
        <div className="flex flex-col gap-1 text-foreground">
          <h2 className="text-xl font-semibold">Snipspace</h2>
          <p className="text-sm text-foreground/60">支持粘贴文本或上传图片，保存后自动进入时间线。</p>
        </div>
      </header>
 
        <form
         className="space-y-8"
         onSubmit={(event) => {
           event.preventDefault();
           void submitDraft();
         }}
       >
        <div className="space-y-3">
          <Textarea
             id="entry-content"
             placeholder="粘贴文本、链接或键入笔记"
             rows={6}
             value={draft.raw}
             onChange={(event) => handleContentChange(event.target.value)}
             onPaste={handlePaste}
           />
         </div>
        <Label
          htmlFor="entry-image"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-3xl border border-border/60 bg-surface/95 px-6 py-8 text-center text-sm text-foreground/70 shadow-elevation-xs transition-all duration-200 ease-mac hover:border-primary/45 hover:bg-surface/90 supports-[backdrop-filter]:bg-surface/65"
        >
          <UploadCloud className="h-6 w-6 text-foreground/60" strokeWidth={1.6} />
          <span className="text-sm font-medium text-primary">将图像拖放到此处</span>
          <span className="text-xs text-foreground/45">- 或 -</span>
          <span className="text-sm font-medium text-primary">点击上传</span>
        </Label>
         <input
          id="entry-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFileSelect(event.target.files?.[0] ?? null)}
         />
         {draft.imageFile ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDraft((prev) => ({ ...prev, imageFile: null, type: "text" }))}
            >
              移除图片
            </Button>
          </div>
         ) : null}
         {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex justify-center">
          <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 保存中
              </>
            ) : (
               "保存"
             )}
           </Button>
         </div>
       </form>
     </section>
   );
 }
