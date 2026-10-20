# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Membuat lib/supabase/server.js dan lib/supabase/index.js menggunakan createClient dari @supabase/supabase-js dengan kredensial SUPABASE_URL dan SUPABASE_SECRET_KEY. Mengubah app/page.jsx menjadi Server Component async yang membaca data langsung dari tabel "produk", menampilkan KartuProduk, menampilkan pesan error jika terjadi kegagalan query, menampilkan "Belum ada produk" jika tabel kosong, serta menghapus komponen CatatanBelumAktif.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Mengubah app/produk/[id]/page.jsx menjadi async Server Component yang membaca parameter URL id (menggunakan await params sesuai spesifikasi Next.js 16), mengambil baris produk tunggal dari tabel "produk" di Supabase menggunakan createServerClient(), memanggil fungsi notFound() bawaan Next.js jika data tidak ada, dan menghapus komponen CatatanBelumAktif dengan mempertahankan tampilan halaman serta TombolWhatsApp.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Mengubah elemen button pada components/TombolWhatsApp.jsx menjadi elemen <a> yang mengarah ke https://wa.me/<nomor>?text=<pesan>. Nomor WhatsApp diformat internasional tanpa tanda +, pesan otomatis dirangkai memuat nama dan harga terformat rupiah dengan encodeURIComponent, tautan dibuka di tab baru (target="_blank" rel="noopener noreferrer"), serta mempertahankan gaya tombol yang sudah ada.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Membuat helper createSessionClient() di lib/supabase/session.js menggunakan @supabase/ssr dan cookies() Next.js 16. Membuat Server Action login dan logout di app/admin/actions.js yang menangani autentikasi Supabase Auth. Menyambungkan form di app/admin/login/page.jsx untuk menampilkan pesan error saat login gagal dan mengarahkan ke /admin saat berhasil. Mengaktifkan tombol "Keluar" di components/NavAdmin.jsx untuk signOut dan kembali ke /admin/login, serta menghapus CatatanBelumAktif.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Membuat Server Action gantiPassword di app/admin/actions.js yang memeriksa sesi login aktif di server, memvalidasi panjang password minimal 8 karakter dan konfirmasi yang cocok, serta memperbarui password via supabase.auth.updateUser(). Menyambungkan form di app/admin/password/page.jsx dengan feedback pesan berhasil atau pesan kesalahan di layar, serta menghapus CatatanBelumAktif.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Membuat proxy.js di root proyek katalog-umkm yang memeriksa sesi Supabase Auth via @supabase/ssr dan mengalihkan request yang belum terautentikasi ke /admin/login untuk seluruh rute /admin (selain /admin/login). Menambahkan helper verifikasiAdmin di lib/supabase/session.js dan memastikan Server Action yang mengubah data memeriksa sesi admin. Menghapus CatatanBelumAktif dari app/admin/page.jsx.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

## Debugging dan fitur bonus

### US-07 List Produk

**Prompt:**
Baca aturan docs/user-stories.md bagian US-07, ingat setiap kali mengerjakan catat di prompts.md propmpt saya megikuti format penulisan di file prompts.mdnya.

**Hasil:**
Mengubah app/admin/page.jsx menjadi Server Component async yang mengambil daftar produk langsung dari database Supabase (tabel "produk") menggunakan createSessionClient() dari lib/supabase/session. Menghapus ketergantungan pada data contoh dari lib/data-contoh.js dan meneruskan data yang diambil ke komponen TabelProduk.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### Debugging Build Vercel (Error Prerendering Server Action)

**Prompt:**
Error occurred prerendering page "/admin". Read more: https://nextjs.org/docs/messages/prerender-error
Error: Failed to find Server Action "7f7354a49a87e74e1d3c67a414bfb0183c89c36723". This request might be from an older or newer deployment.
Read more: https://nextjs.org/docs/messages/failed-to-find-server-action
Export encountered an error on /admin/page: /admin, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
Error: [BUILD_UTILS_SPAWN_1] Command "npm run build" exited with 1

perbaiki ini ini log dari versel deplonya

**Hasil:**
1. Membersihkan app/admin/actions.js dari re-export non-action (`export { verifikasiAdmin }`) dan assignment alias variabel (`export const keluar = logout`) yang menyebabkan Next.js Turbopack compiler gagal memetakan ID manifest Server Action saat proses build.
2. Mendeklarasikan alias action sebagai fungsi async eksplisit (`export async function keluar() { return logout(); }`).
3. Menambahkan file app/admin/layout.jsx dengan `export const dynamic = "force-dynamic"` agar seluruh segmen rute di bawah /admin selalu dirender dinamis di server saat runtime, mencegah Next.js mencoba melakukan static prerendering pada rute admin yang terlindungi sesi.

**Perbaikan:**
Format export pada app/admin/actions.js disesuaikan dengan standar Next.js Server Actions dan segmen /admin diproteksi dynamic rendering agar build di Vercel selesai tanpa error prerender.


### US-08 Tambah produk

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat Server Action tambahProduk di app/admin/actions.js yang terlindungi verifikasi login di server, memvalidasi input nama dan harga, lalu menyimpan produk baru ke tabel "produk" di Supabase. Menyambungkan FormProduk pada app/admin/produk/baru/page.jsx dan menghapus CatatanBelumAktif. Setelah menyimpan, halaman otomatis dialihkan kembali ke /admin.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-09 Ubah produk

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat Server Action ubahProduk di app/admin/actions.js yang terlindungi verifikasi login admin di server dan memperbarui record produk di tabel "produk". Mengubah app/admin/produk/[id]/ubah/page.jsx untuk mengambil data produk dari database Supabase secara real-time dan mengisinya ke FormProduk. Menghapus CatatanBelumAktif.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-10 Hapus produk

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat Server Action hapusProduk di app/admin/actions.js yang menghapus baris produk dari database dengan proteksi login admin di server. Mengubah components/TabelProduk.jsx menjadi komponen interaktif dengan dialog konfirmasi sebelum submit penghapusan produk.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-11 Filter kategori atau pencarian

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Menambahkan fitur filter kategori dinamis dan form pencarian nama produk pada app/page.jsx. Query ke Supabase disesuaikan dengan parameter kategori (eq) dan nama produk (ilike) dari URL searchParams. Dilengkapi tombol reset untuk kembali melihat seluruh produk.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-12 Pilih jumlah atau varian

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Memperbarui components/TombolWhatsApp.jsx agar pengunjung dapat memilih jumlah produk (kuantitas) sebelum memesan. Jumlah yang dipilih beserta total harga otomatis diperhitungkan dan dicantumkan ke dalam template pesan WhatsApp yang di-encode.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-13 PWA (Progressive Web App)

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat app/manifest.js untuk menghasilkan web app manifest Next.js yang merujuk ikon dari public/icons/icon-192.png dan icon-512.png. Menambahkan konfigurasi metadata dan link manifest pada app/layout.jsx agar katalog dapat dipasang (install) di layar utama perangkat seluler.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.


### US-08 Tambah produk

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat Server Action tambahProduk di app/admin/actions.js yang terlindungi verifikasi login di server, memvalidasi input nama dan harga, lalu menyimpan produk baru ke tabel "produk" di Supabase. Menyambungkan FormProduk pada app/admin/produk/baru/page.jsx dan menghapus CatatanBelumAktif. Setelah menyimpan, halaman otomatis dialihkan kembali ke /admin.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-09 Ubah produk

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat Server Action ubahProduk di app/admin/actions.js yang terlindungi verifikasi login admin di server dan memperbarui record produk di tabel "produk". Mengubah app/admin/produk/[id]/ubah/page.jsx untuk mengambil data produk dari database Supabase secara real-time dan mengisinya ke FormProduk. Menghapus CatatanBelumAktif.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-10 Hapus produk

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat Server Action hapusProduk di app/admin/actions.js yang menghapus baris produk dari database dengan proteksi login admin di server. Mengubah components/TabelProduk.jsx menjadi komponen interaktif dengan dialog konfirmasi sebelum submit penghapusan produk.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-11 Filter kategori atau pencarian

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Menambahkan fitur filter kategori dinamis dan form pencarian nama produk pada app/page.jsx. Query ke Supabase disesuaikan dengan parameter kategori (eq) dan nama produk (ilike) dari URL searchParams. Dilengkapi tombol reset untuk kembali melihat seluruh produk.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-12 Pilih jumlah atau varian

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Memperbarui components/TombolWhatsApp.jsx agar pengunjung dapat memilih jumlah produk (kuantitas) sebelum memesan. Jumlah yang dipilih beserta total harga otomatis diperhitungkan dan dicantumkan ke dalam template pesan WhatsApp yang di-encode.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

### US-13 PWA (Progressive Web App)

**Prompt:**
Baca aturan docs/user-stories.md kerjakan semua us- yang belum, ingat setiap kali mengerjakan catat di prompts.md

**Hasil:**
Membuat app/manifest.js untuk menghasilkan web app manifest Next.js yang merujuk ikon dari public/icons/icon-192.png dan icon-512.png. Menambahkan konfigurasi metadata dan link manifest pada app/layout.jsx agar katalog dapat dipasang (install) di layar utama perangkat seluler.

**Perbaikan:**
Tidak ada perbaikan lanjutan yang diperlukan.

