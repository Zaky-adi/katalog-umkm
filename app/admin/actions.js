"use server";

import { redirect } from "next/navigation";
import { createSessionClient, verifikasiAdmin } from "@/lib/supabase/session";

export { verifikasiAdmin };

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

/**
 * Server Action untuk ganti password admin yang sedang login.
 * Memeriksa sesi login admin di server sebelum mengubah data.
 * Memvalidasi password baru minimal 8 karakter dan konfirmasi cocok.
 */
export async function gantiPassword(arg1, arg2) {
  const isActionState = Boolean(arg2 && arg2 instanceof FormData);
  const formData = isActionState ? arg2 : arg1;

  let supabase;
  try {
    supabase = await createSessionClient();
  } catch (err) {
    const errorMsg = err.message || "Gagal menghubungkan ke server auth.";
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/password?error=${encodeURIComponent(errorMsg)}`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    if (isActionState) {
      return { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." };
    }
    redirect("/admin/login");
  }

  let pesanError = null;
  let pesanSukses = null;

  try {
    const passwordBaru = formData?.get?.("password_baru")?.toString() || "";
    const konfirmasiPassword = formData?.get?.("konfirmasi_password")?.toString() || "";

    if (!passwordBaru || passwordBaru.length < 8) {
      pesanError = "Password baru minimal 8 karakter.";
    } else if (passwordBaru !== konfirmasiPassword) {
      pesanError = "Konfirmasi password tidak sama dengan password baru.";
    } else {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordBaru,
      });

      if (updateError) {
        pesanError = updateError.message;
      } else {
        pesanSukses = "Password berhasil diperbarui.";
      }
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat mengganti password.";
  }

  if (pesanError) {
    if (isActionState) {
      return { error: pesanError };
    }
    redirect(`/admin/password?error=${encodeURIComponent(pesanError)}`);
  }

  if (isActionState) {
    return { sukses: pesanSukses };
  }
  redirect(`/admin/password?sukses=${encodeURIComponent(pesanSukses)}`);
}

export const ubahPassword = gantiPassword;
