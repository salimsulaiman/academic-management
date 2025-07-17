## 🎯 Keputusan Desain & Arsitektur

### 1. Pemecahan Komponen

- `DashboardLayout`: Pembungkus layout utama
- `Sidebar`, `Topbar`: Elemen navigasi
- `ChapterCard`, `Card`: Menampilkan berbagai tampilan data

### 2. Struktur State

**Global state (Zustand) menyimpan:**

- Seluruh daftar kelas akademik (`classes`) beserta konfigurasi lengkapnya
- Konfigurasi komponen nilai (seperti kuis, tugas, proyek) dan bab untuk setiap kelas
- Daftar mahasiswa dan nilai mereka berdasarkan komponen dan bab
- Status konfigurasi masing-masing kelas (selesai/belum selesai)

Semua data tersebut disimpan dalam satu objek bertipe `AcademicData` dan dimutakhirkan melalui fungsi `setData()`.

**Global state (React Context) menyimpan:**

- **SidebarContext**:  
  Mengatur status buka/tutup sidebar untuk menyesuaikan layout halaman.

- **ThemeContext**:  
  Mengelola mode tema UI (terang/gelap), termasuk fungsi toggle dan penyimpanan preferensi di `localStorage`.

### 3. Logika Konfigurasi Nilai

- Komponen nilai (seperti Kuis, Proyek) memiliki bobot persentase
- Setiap bab berkontribusi terhadap nilai komponen tersebut
- Nilai akhir per komponen = Rata-rata nilai bab × bobot komponen

### 4. Ekspor File

- Nilai mahasiswa diekspor ke `.xlsx` menggunakan pustaka `xlsx` dan `file-saver`
- Format data: NIM, Nama, [Kolom Komponen × Bab]

### 5. Routing & Middleware

- Middleware mengarahkan `/` langsung ke `/dashboard`
- Routing dinamis menggunakan App Router:
  - `/class/[slug]/configuration`
  - `/class/[slug]/nilai`

---
