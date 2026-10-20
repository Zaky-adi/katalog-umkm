"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  let nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  if (nomor.startsWith("0")) {
    nomor = "62" + nomor.slice(1);
  }

  const totalHarga = (produk.harga || 0) * jumlah;
  const pesan =
    jumlah > 1
      ? `Halo, saya ingin memesan ${jumlah}x ${produk.nama} dengan total ${formatRupiah(totalHarga)}.`
      : `Halo, saya ingin memesan ${produk.nama} seharga ${formatRupiah(produk.harga)}.`;

  const href = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Pemilihan jumlah produk (US-12) */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-teks-lembut">Jumlah:</span>
        <div className="flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 text-sm font-semibold text-teks-lembut hover:text-teks disabled:opacity-40"
            disabled={jumlah <= 1}
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => prev + 1)}
            className="px-3 py-1 text-sm font-semibold text-teks-lembut hover:text-teks"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
        {jumlah > 1 && (
          <span className="text-sm font-semibold text-teks">
            Total: {formatRupiah(totalHarga)}
          </span>
        )}
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
