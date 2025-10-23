interface SupabaseConfig {
  readonly url: string;
  readonly anonKey: string;
}

/**
 * Reads Supabase environment variables and fails fast in development.
 */
export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("Supabase URL or anon key is missing. Add them to your .env.local file.");
    }

    return {
      url: url ?? "",
      anonKey: anonKey ?? "",
    };
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export function getSupabaseVerifyPasswordUrl(): string | null {
  return process.env.SUPABASE_VERIFY_PASSWORD_URL ?? null;
}

export function getSupabaseVerifyPasswordKey(): string | null {
  return process.env.SUPABASE_VERIFY_PASSWORD_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}
