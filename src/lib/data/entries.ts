import { cookies } from "next/headers";

import type { Entry, GroupedEntries } from "@/lib/data/fixtures";
import { getMockEntries } from "@/lib/data/fixtures";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface EntryRow {
  id: string;
  title: string | null;
  content: string;
  content_type: string;
  source_url: string | null;
  created_at: string;
  tags: string[] | null;
}

const allowedTypes = new Set<Entry["type"]>(["text", "link", "image", "video", "snippet", "mixed"]);

function mapType(value: string): Entry["type"] {
  if (allowedTypes.has(value as Entry["type"])) {
    return value as Entry["type"];
  }
  return "text";
}

function groupEntries(rows: EntryRow[]): GroupedEntries[] {
  const groups = new Map<string, EntryRow[]>();

  for (const row of rows) {
    const day = row.created_at.split("T")[0];
    if (!groups.has(day)) {
      groups.set(day, []);
    }
    groups.get(day)!.push(row);
  }

  return Array.from(groups.entries())
    .sort(([dayA], [dayB]) => (dayA > dayB ? -1 : 1))
    .map(([day, entries]) => ({
      day,
      entries: entries.map<Entry>((entry) => ({
        id: entry.id,
        title: entry.title ?? undefined,
        content: entry.content,
        type: mapType(entry.content_type),
        sourceUrl: entry.source_url ?? undefined,
        createdAt: entry.created_at,
        tags: entry.tags ?? undefined,
      })),
    }));
}

export async function fetchGroupedEntries(): Promise<GroupedEntries[]> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return getMockEntries();
  }

  try {
    const supabase = createSupabaseServerClient(cookieStore);
    const { data, error } = await supabase
      .from("entries")
      .select("id,title,content,content_type,source_url,created_at,tags")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !data) {
      console.error("Failed to fetch entries from Supabase", error);
      return getMockEntries();
    }

    if (data.length === 0) {
      return getMockEntries();
    }

    return groupEntries(data as EntryRow[]);
  } catch (error) {
    console.error("Supabase connection error", error);
    return getMockEntries();
  }
}
