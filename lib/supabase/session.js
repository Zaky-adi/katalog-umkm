import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

/**
 * Memverifikasi bahwa pengguna yang sedang mengakses adalah admin yang sudah login.
 * Jika belum login, dialihkan ke /admin/login.
 */
export async function verifikasiAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return { supabase, user };
}

export const getSupabaseSessionClient = createSessionClient;
