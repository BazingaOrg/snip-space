import bcrypt from "bcryptjs";

import { getSupabaseVerifyPasswordKey, getSupabaseVerifyPasswordUrl } from "@/lib/supabase/env";

interface VerifyResponse {
  readonly ok: boolean;
  readonly message?: string;
}

async function verifyViaSupabase(password: string): Promise<boolean> {
  const endpoint = getSupabaseVerifyPasswordUrl();
  if (!endpoint) {
    return false;
  }

  const apiKey = getSupabaseVerifyPasswordKey();
  if (!apiKey) {
    throw new Error("Supabase verify password key is missing.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ password }),
  });

  if (response.status === 401) {
    return false;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase verify function error: ${text || response.statusText}`);
  }

  const data = (await response.json().catch(() => null)) as VerifyResponse | null;
  return data?.ok ?? true;
}

async function verifyViaEnvironment(password: string): Promise<boolean> {
  const hashedSecret = process.env.ACCESS_PASSWORD_HASH;
  const plainSecret = process.env.ACCESS_PASSWORD;

  if (!hashedSecret && !plainSecret) {
    throw new Error(
      "Access password is not configured. Set ACCESS_PASSWORD_HASH (recommended) or ACCESS_PASSWORD.",
    );
  }

  if (!password) {
    return false;
  }

  if (hashedSecret) {
    try {
      return await bcrypt.compare(password, hashedSecret);
    } catch (error) {
      console.error("Failed to compare hashed password", error);
      return false;
    }
  }

  return password === plainSecret;
}

/**
 * Verifies the provided password using the Supabase Edge Function when available,
 * otherwise falls back to environment-based secrets.
 */
export async function verifyAccessPassword(password: string): Promise<boolean> {
  const endpoint = getSupabaseVerifyPasswordUrl();

  if (endpoint) {
    try {
      return await verifyViaSupabase(password);
    } catch (error) {
      console.error("Supabase password verification failed", error);
      throw error;
    }
  }

  return verifyViaEnvironment(password);
}
