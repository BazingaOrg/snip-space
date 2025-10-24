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
    title: "晨间思考：聚焦一件小事",
    content:
      "把今天的时间留给一件真正重要的小事，剩下的交给明天的自己。\n\n写下这件小事，并为它安排一个 45 分钟的深度时间段，完成后记得奖励自己。",
    type: "text",
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["journal"],
  },
  {
    id: "2",
    title: "Next.js App Router 上手指南",
    content: "https://nextjs.org/learn/dashboard-app",
    type: "link",
    sourceUrl: "https://nextjs.org/learn/dashboard-app",
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["docs", "nextjs"],
  },
  {
    id: "3",
    title: "黄昏下的城市剪影",
    content:
      "https://images.unsplash.com/photo-1526481280695-3c46917f2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eSUyMHN1bnNldHxlbnwwfHwwfHx8MA%3D%3D&q=80&h=800",
    type: "image",
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["photography", "inspiration"],
  },
  {
    id: "4",
    title: "格式化价格工具函数",
    content: `export function formatPrice(amount: number) {\n  return new Intl.NumberFormat("zh-CN", {\n    style: "currency",\n    currency: "CNY",\n    maximumFractionDigits: 2,\n  }).format(amount);\n}`,
    type: "snippet",
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    tags: ["frontend", "utils"],
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
