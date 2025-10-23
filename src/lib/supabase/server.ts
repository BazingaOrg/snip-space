import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "./env";

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  set?: (name: string, value: string, options: CookieOptions) => void;
  delete?: (name: string, options: CookieOptions) => void;
};

/**
 * Creates a Supabase server client using the provided cookie store.
 * Pass `cookies()` from Next.js when calling this helper.
 */
export function createSupabaseServerClient(cookieStore: CookieStore): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set?.(name, value, options);
      },
      remove(name, options) {
        if (cookieStore.delete) {
          cookieStore.delete(name, options);
        } else if (cookieStore.set) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        }
      },
    },
  });
}
