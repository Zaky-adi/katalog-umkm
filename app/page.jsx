import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kategoriTerpilih = params?.kategori || "";
  const queryCari = params?.q || "";

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Mengambil daftar semua kategori unik untuk filter
    const { data: katData } = await supabase.from("produk").select("kategori");
    if (katData) {
      daftarKategori = Array.from(
        new Set(katData.map((p) => p.kategori).filter(Boolean))
      );
    }

    // Query daftar produk dengan filter kategori dan pencarian nama (US-11)
    let query = supabase.from("produk").select("*");

    if (kategoriTerpilih) {
      query = query.eq("kategori", kategoriTerpilih);
    }

    if (queryCari) {
      query = query.ilike("nama", `%${queryCari}%`);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal mengambil data produk dari server.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian Produk (US-11) */}
          <form method="GET" action="/" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={queryCari}
              placeholder="Cari nama produk..."
              className="rounded-xl border border-garis bg-latar px-3.5 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            />
            {kategoriTerpilih && (
              <input type="hidden" name="kategori" value={kategoriTerpilih} />
            )}
            <button
              type="submit"
              className="rounded-xl bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
            >
              Cari
            </button>
            {(queryCari || kategoriTerpilih) && (
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-garis px-3 py-2 text-sm text-teks-lembut hover:text-teks"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Filter Kategori (US-11) */}
        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={queryCari ? `/?q=${encodeURIComponent(queryCari)}` : "/"}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                !kategoriTerpilih
                  ? "bg-utama text-white"
                  : "border border-garis bg-permukaan text-teks-lembut hover:text-teks"
              }`}
            >
              Semua
            </Link>
            {daftarKategori.map((kat) => {
              const isActive = kategoriTerpilih === kat;
              const href = `/?kategori=${encodeURIComponent(kat)}${
                queryCari ? `&q=${encodeURIComponent(queryCari)}` : ""
              }`;
              return (
                <Link
                  key={kat}
                  href={href}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks-lembut hover:text-teks"
                  }`}
                >
                  {kat}
                </Link>
              );
            })}
          </div>
        )}

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
            Gagal mengambil data produk: {pesanError}
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="rounded-xl border border-dashed border-garis bg-permukaan p-6 text-center text-sm text-teks-lembut">
            Belum ada produk
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
