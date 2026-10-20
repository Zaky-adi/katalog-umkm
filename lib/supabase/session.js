import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase untuk sesi admin dengan cookie (@supabase/ssr).
 * Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 * Digunakan untuk Server Component, Server Action, dan Route Handler yang membutuhkan sesi login.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component, perubahan cookie diabaikan
        }
      },
    },
  });
}

export const getSupabaseSessionClient = createSessionClient;

