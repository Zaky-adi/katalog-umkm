"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk login admin.
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

export async function keluar() {
  return logout();
}

/**
 * Server Action untuk ganti password admin yang sedang login (US-05).
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

export async function ubahPassword(arg1, arg2) {
  return gantiPassword(arg1, arg2);
}

/**
 * Server Action untuk menambah produk baru (US-08).
 * Terlindungi login: tanpa login ditolak oleh server.
 */
export async function tambahProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const nama = formData.get("nama")?.toString()?.trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString()?.trim() || null;
  const foto_url = formData.get("foto_url")?.toString()?.trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString()?.trim() || null;

  if (!nama || isNaN(harga)) {
    throw new Error("Nama produk dan harga wajib diisi.");
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    throw new Error(`Gagal menambah produk: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

/**
 * Server Action untuk mengubah produk (US-09).
 * Terlindungi login: tanpa login ditolak oleh server.
 */
export async function ubahProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  const nama = formData.get("nama")?.toString()?.trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString()?.trim() || null;
  const foto_url = formData.get("foto_url")?.toString()?.trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString()?.trim() || null;

  if (!id || !nama || isNaN(harga)) {
    throw new Error("Data produk tidak lengkap.");
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Gagal mengubah produk: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/produk/${id}/ubah`);
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

/**
 * Server Action untuk menghapus produk (US-10).
 * Terlindungi login: tanpa login ditolak oleh server.
 */
export async function hapusProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");

  if (!id) {
    throw new Error("ID produk tidak ditemukan.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus produk: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
