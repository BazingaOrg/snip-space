import { randomUUID } from "crypto";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { ENTRY_IMAGES_BUCKET, IMAGE_LIMIT } from "@/lib/constants";
import type { EntryType } from "@/lib/data/fixtures";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function inferSourceUrl(type: EntryType, content: string, provided?: string | null) {
  if (type === "link" || type === "video") {
    if (provided && provided.trim().length > 0) return provided.trim();
    if (/^https?:\/\//i.test(content.trim())) return content.trim();
  }
  return provided ?? null;
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "未授权，请先解锁" }, { status: 401 });
  }

  const formData = await request.formData();
  const type = formData.get("type") as EntryType | null;
  const rawContent = formData.get("content");
  const title = formData.get("title")?.toString().slice(0, 200) ?? null;
  const sourceUrl = formData.get("sourceUrl")?.toString() ?? null;
  const image = formData.get("image") as File | null;

  if (!type) {
    return NextResponse.json({ message: "缺少内容类型" }, { status: 400 });
  }

  if (!rawContent && !image) {
    return NextResponse.json({ message: "请提供文本内容或图片" }, { status: 400 });
  }

  if (image && image.size > IMAGE_LIMIT) {
    return NextResponse.json({ message: "图片超过 10MB，请压缩后再上传" }, { status: 400 });
  }

  const content = typeof rawContent === "string" ? rawContent : "";

  try {
    const supabase = createSupabaseServerClient(cookieStore);

    let uploadedPath: string | null = null;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExt = image.type.split("/").pop() ?? "png";
      const path = `images/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from(ENTRY_IMAGES_BUCKET)
        .upload(path, buffer, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase storage upload failed", uploadError);
        return NextResponse.json({ message: "图片上传失败，请稍后再试" }, { status: 500 });
      }

      uploadedPath = path;
    }

    const now = new Date();
    const createdDay = now.toISOString().split("T")[0];
    const payload = {
      title,
      content,
      content_type: type,
      source_url: inferSourceUrl(type, content, sourceUrl),
      created_at: now.toISOString(),
      created_day: createdDay,
      tags: [] as string[],
    };

    const { data: insertedEntry, error: insertError } = await supabase
      .from("entries")
      .insert(payload)
      .select("id,title,content,content_type,source_url,created_at,tags")
      .single();

    if (insertError || !insertedEntry) {
      console.error("Supabase insert failed", insertError);
      return NextResponse.json({ message: "保存失败，请检查 Supabase 表配置" }, { status: 500 });
    }

    if (uploadedPath) {
      const { error: assetError } = await supabase.from("assets").insert({
        entry_id: insertedEntry.id,
        storage_path: uploadedPath,
        mime_type: image?.type ?? "image/png",
        size_bytes: image?.size ?? 0,
      });
      if (assetError) {
        console.error("Failed to record asset metadata", assetError);
      }
    }

    return NextResponse.json({
      message: "ok",
      entry: insertedEntry,
    });
  } catch (error) {
    console.error("Supabase pipeline error", error);
    return NextResponse.json({ message: "Supabase 未就绪或连接失败" }, { status: 500 });
  }
}
