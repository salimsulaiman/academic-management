## Dokumentasi Penggunaan AI

### Penggunaan AI

**ChatGPT**: Digunakan untuk merancang ide dan konsep proyek.

### ✅ Area Kolaborasi dengan AI

#### 1. **Desain UI Responsif**

- AI membantu menyarankan pola layout responsif menggunakan **Tailwind CSS** dan **Material UI**, memastikan dashboard berjalan dengan baik di mobile, tablet, dan desktop.
- Menghasilkan layout berbasis grid dan flex, strategi pengaturan jarak, serta perilaku sidebar yang adaptif.

#### 2. **Implementasi Dark Mode**

- Mengimplementasikan sistem toggle tema menggunakan **React Context** dan utilitas `dark:` dari Tailwind.
- Menambahkan class `dark:` pada setiap komponen yang mendukung mode gelap.

#### 3. **Arsitektur Global State**

- Menggunakan **Zustand** untuk mengelola state global, termasuk data kelas, pengaturan konfigurasi, dan nilai mahasiswa.

#### 4. **Logika Perhitungan Nilai**

- Berkolaborasi dalam menyusun logika perhitungan nilai:
  - Menggunakan bobot komponen dan kontribusi per bab.
  - Struktur pencarian bersarang: `grades[studentId][component][chapter]`.
  - Merancang rumus rata-rata dan pembobotan.
- AI membantu menjelaskan dan memperbaiki iterasi type-safe terhadap struktur record bersarang di TypeScript.

#### 5. **Penanganan Error & Debugging**

- Membantu menyelesaikan masalah terkait:
  - Pengetikan TypeScript (contoh: error `string | number`).
  - Mutasi dan pengambilan data dari store Zustand.
  - Error inisialisasi React Context (`context undefined`).

#### 6. **Pembuatan Data Mock**

- Membantu menghasilkan data JSON mock yang realistis untuk:
  - 3 kelas, masing-masing berisi 15–20 mahasiswa.
  - 5 komponen nilai dan 5 bab per kelas.
  - Nilai acak namun konsisten pada struktur data bersarang.

---

### ⏱️ Hasil

Penggunaan AI membantu:

- Mempercepat waktu pengembangan prototipe.
- Meningkatkan keyakinan dalam pengambilan keputusan arsitektur.
- Meningkatkan konsistensi dalam desain UI/UX dan struktur kode.

---
