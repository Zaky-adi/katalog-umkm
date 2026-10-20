import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server memakai SUPABASE_URL dan SUPABASE_SECRET_KEY.
 * Digunakan untuk Server Component, Server Action, atau Route Handler untuk membaca data publik.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const getSupabaseServerClient = createServerClient;
export const createClientServer = createServerClient;

export { createSessionClient } from "./session";
