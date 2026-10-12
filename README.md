# Technotama Cybersecurity Academy - Learning Management System (LMS)

Interactive high-fidelity web application and prototype for **Technotama Cybersecurity Academy**, providing practice-oriented EdTech learning paths aligned with industry standards (Deep Navy, Gray, Gold, White design system).

Repository GitHub: [https://github.com/elanghaqeem-hash/cybac](https://github.com/elanghaqeem-hash/cybac)

---

## 🚀 Fitur Utama

1. **Authentication & Password Security Policy**
   - **Form Login Interaktif** dengan validasi kredensial.
   - **Show / Hide Password**: Tombol lihat dan sembunyikan password dengan ikon FontAwesome.
   - **Forgot Password Modal**: Dialog modal untuk pengiriman simulasi link reset password.
   - **Kebijakan Perubahan Kata Sandi Wajib**:
     - Diwajibkan saat **pertama kali login**.
     - Diwajibkan kembali setiap **3 bulan sekali** (rotasi berkala 90 hari).
     - Simulator pengujian kadaluarsa 3 bulan untuk mempermudah QA testing.

2. **Onboarding Wizard & Skills Placement**
   - 5 tahapan onboarding: Selamat Datang, Pengisian Profil, Pemilihan Karir Target (SOC Analyst, Pentester, IR, GRC), Tes Penempatan Interaktif, dan Rekomendasi Jalur Belajar.

3. **Multi-Role Dashboard & Switcher**
   - **Student View**: Dashboard progress belajar, XP, streak, dan metrik kompetensi.
   - **Instructor View**: Monitoring mahasiswa dan review tugas.
   - **Assessor View**: Penilaian studi kasus dan capstone.
   - **Admin View**: Manajemen sistem dan analitik kohort.

4. **Hands-On Cyber Labs & Mini-SIEM**
   - **Cyber Range Sandbox**: Simulator terminal Linux CLI (`nmap`, `tshark`, `ls`, dll.) untuk analisis paket Wireshark.
   - **SOC Mini SIEM Incident Manager**: Investigasi alert keamanan (PowerShell download, Brute Force, DNS Tunneling) dan mitigasi insiden.
   - **Capture The Flag (CTF)**: Tantangan CTF Jeopardy dengan validasi submit flag secara real-time.

5. **Portfolio, Career & Verified Credentials**
   - Generator CV / Portofolio digital yang dapat dipublikasikan.
   - Sertifikat kelulusan digital (*Certificate of Completion*) dan *Badges Vault*.
   - Job Matching Center dengan kurasi lowongan kerja mitra industri.

---

## 🔑 Kredensial Pengguna Default

| Field | Nilai Default |
|-------|---------------|
| **Email / Username** | `andi.cyber` |
| **Password Awal** | `password123` |
| **Role Default** | Student (Target: SOC Analyst) |

> **Catatan:** Setelah login pertama kali, sistem akan mengarahkan pengguna ke halaman penggantian kata sandi baru (minimal 8 karakter, kombinasi huruf dan angka).

---

## 💻 Cara Menjalankan Proyek

### Cara 1: Langsung di Browser
Buka file `index.html` secara langsung menggunakan browser pilihan Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).

### Cara 2: Menggunakan Node.js / Local Server
```bash
# Menjalankan server lokal ringan
npm run dev
```
Akses di browser: `http://localhost:3000`

---

## 🔄 Otomatisasi Push ke GitHub

Untuk melakukan commit dan push perubahan secara otomatis ke repository `origin main`:

### Menggunakan NPM Script
```bash
npm run push
```

### Menggunakan PowerShell Script
```powershell
.\push-auto.ps1 -Message "Pesan commit perubahan"
```

### Menggunakan Batch Script
Klik ganda file `push-auto.bat` atau jalankan:
```cmd
push-auto.bat "Pesan commit"
```

---

## 📁 Struktur File

```
├── .github/
│   └── workflows/
│       └── pages.yml          # Otomatisasi deploy ke GitHub Pages
├── app.js                     # Engine interaktif client-side & manajemen state
├── index.html                 # Halaman utama aplikasi LMS
├── style.css                  # Desain sistem CSS & tema Technotama
├── package.json               # Konfigurasi npm scripts
├── push-auto.ps1              # Script otomatisasi push PowerShell
├── push-auto.bat              # Script otomatisasi push Windows Batch
├── .gitignore                 # Daftar file/folder yang diabaikan Git
└── README.md                  # Dokumentasi proyek
```

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © Technotama Cybersecurity Academy. Seluruh hak cipta dilindungi undang-undang.
