# Noval Abdillah - Full Stack SaaS Portfolio 🚀

Website portofolio interaktif dan modern yang dibangun menggunakan teknologi mutakhir: **Next.js 16 (App Router)**, **Tailwind CSS**, **Supabase (PostgreSQL & Storage)**, serta animasi menggunakan **GSAP**.

Proyek ini tidak hanya sekadar profil statis, melainkan sebuah **SaaS Mini** yang dilengkapi dengan sistem autentikasi dan CMS (Content Management System) pribadi untuk mengelola daftar proyek secara dinamis langsung dari Dashboard Admin.

---

## 🌟 Fitur Utama
- **⚡ Next.js App Router**: Routing secepat kilat dengan *Server-Side Rendering (SSR)*.
- **🔐 Sistem Autentikasi Admin**: Akses dashboard aman menggunakan Supabase Auth (Email & Password).
- **📝 CMS Pribadi**: Tambah, ubah, dan hapus portofolio proyek langsung dari website tanpa menyentuh kode.
- **🖼️ Penyimpanan Gambar Otomatis**: Upload gambar *thumbnail* proyek langsung ke Supabase Storage Bucket.
- **🌍 Multi-Bahasa (i18n)**: Dukungan bahasa Inggris (EN) dan Indonesia (ID).
- **🎨 Animasi Halus & Responsif**: Menggunakan GSAP untuk transisi halaman dan elemen UI yang interaktif (termasuk kursor kustom).

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Next.js 16, Tailwind CSS, GSAP
- **Backend/BaaS**: Supabase (PostgreSQL Database, Auth, Storage)
- **Deployment**: Vercel

---

## 🚀 Tutorial Penggunaan & Instalasi Lokal

Jika Anda ingin menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

### 1. Kloning Repositori
```bash
git clone https://github.com/santetgan123-ui/noval-portfolio.git
cd noval-portfolio
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Siapkan Supabase (Database & Storage)
Buat proyek baru di [Supabase](https://supabase.com). Jalankan *SQL Script* berikut di menu **SQL Editor** Supabase Anda untuk menyiapkan tabel dan penyimpanan gambar:

```sql
-- MEMBUAT TABEL PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Siapapun bisa melihat project" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin bisa menambah project" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin bisa mengubah project" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin bisa menghapus project" ON public.projects FOR DELETE TO authenticated USING (true);

-- MEMBUAT BUCKET GAMBAR
INSERT INTO storage.buckets (id, name, public) VALUES ('project-thumbnails', 'project-thumbnails', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Siapapun bisa melihat gambar" ON storage.objects FOR SELECT USING (bucket_id = 'project-thumbnails');
CREATE POLICY "Admin bisa upload gambar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-thumbnails');
CREATE POLICY "Admin bisa update gambar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-thumbnails');
CREATE POLICY "Admin bisa hapus gambar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-thumbnails');
```
*Catatan: Buat juga pengguna baru (Admin) melalui menu **Authentication** di Supabase.*

### 4. Atur Environment Variables
Buat file bernama `.env.local` di *root* folder proyek Anda, lalu isi dengan Keys dari Supabase (Project Settings > API):
```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```

### 5. Jalankan Server Lokal
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🔒 Akses Dashboard Admin
Untuk mengakses panel kontrol dan mengunggah portofolio:
1. Buka URL: `https://[domain-anda]/admin/login` (Atau `/admin/login` di localhost)
2. Masukkan email dan password admin yang telah Anda buat di Supabase Auth.
3. Setelah login berhasil, Anda akan dialihkan ke Dashboard Admin untuk mulai mengelola portofolio!

---

**© 2026 Noval Abdillah.** Semua Hak Cipta Dilindungi. Dibuat dengan antusiasme dan AI.
