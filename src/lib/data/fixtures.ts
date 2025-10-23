import { format, subDays } from "date-fns";

export type EntryType = "text" | "link" | "image" | "video" | "snippet" | "mixed";

export interface Entry {
  readonly id: string;
  readonly title?: string;
  readonly content: string;
  readonly type: EntryType;
  readonly sourceUrl?: string;
  readonly createdAt: string;
  readonly tags?: string[];
}

export interface GroupedEntries {
  readonly day: string;
  readonly entries: Entry[];
}

const mockEntries: Entry[] = [
  {
    id: "1",
    title: "《你好，世界》中的一句话",
    content: "保持好奇，拥抱变化，然后用工具记录你的灵感。",
    type: "text",
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["quote", "inspiration"],
  },
  {
    id: "2",
    title: "Supabase Edge Functions 文档",
    content: "https://supabase.com/docs/guides/functions",
    type: "link",
    sourceUrl: "https://supabase.com/docs/guides/functions",
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["docs"],
  },
  {
    id: "3",
    title: "色彩灵感",
    content: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    type: "image",
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["design", "palette"],
  },
  {
    id: "4",
    title: "Interface 镇静配色指南",
    content: "使用柔和玻璃拟态背景时记得控制 blur 与 saturation 避免文本失真。",
    type: "snippet",
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  },
];

export function getMockEntries(): GroupedEntries[] {
  const groups = new Map<string, Entry[]>();

  for (const entry of mockEntries) {
    const day = entry.createdAt.split("T")[0];
    if (!groups.has(day)) {
      groups.set(day, []);
    }

    groups.get(day)!.push(entry);
  }

  return Array.from(groups.entries())
    .sort(([dayA], [dayB]) => (dayA > dayB ? -1 : 1))
    .map(([day, entries]) => ({ day, entries }));
}
