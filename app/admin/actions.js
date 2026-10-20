"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk login admin.
 * Memproses email dan password menggunakan Supabase Auth.
 * Jika berhasil: mengarahkan ke /admin.
 * Jika gagal: mengarahkan kembali ke /admin/login dengan pesan error.
 */
export async function login(arg1, arg2) {
  const isActionState = Boolean(arg2 && arg2 instanceof FormData);
  const formData = isActionState ? arg2 : arg1;
  let pesanError = null;

  try {
    const email = formData?.get?.("email")?.toString()?.trim();
    const password = formData?.get?.("password")?.toString();

    if (!email || !password) {
      pesanError = "Email dan password wajib diisi.";
    } else {
      const supabase = await createSessionClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          pesanError = "Email atau password salah. Silakan coba lagi.";
        } else {
          pesanError = error.message;
        }
      }
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat proses login.";
  }

  if (pesanError) {
    if (isActionState) {
      return { error: pesanError };
    }
    redirect(`/admin/login?error=${encodeURIComponent(pesanError)}`);
  }

  redirect("/admin");
}

/**
 * Server Action untuk logout admin.
 * Mengakhiri sesi Supabase Auth dan mengarahkan kembali ke /admin/login.
 */
export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Gagal keluar:", err);
  }

  redirect("/admin/login");
}

export const keluar = logout;

