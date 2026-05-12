# Eco-Share API — UTS Fullstack

Nama : Muhammad Zidhan Fadillah
NIM : 411231016
Mata Kuliah : Pemrograman Fullstack

## Deskripsi

Aplikasi Backend API untuk penyewaan alat elektronik bekas menggunakan **Node.js** dan **MySQL**.

## Fitur Utama
- **Stateless Auth**: Menggunakan JWT untuk keamanan.
- **Role-Based Access (RBAC)**: Perbedaan hak akses antara Owner dan Renter via middleware guard.
- **Service Layer**: Logika bisnis terpisah dari controller (MVC + Service Layer pattern).
- **Database Transactions**: Menggunakan MySQL InnoDB dengan Row-Level Locking (`FOR UPDATE`) untuk mencegah double booking.
- **Global Error Handler**: Penanganan error yang tersentralisasi.
- **Environment Variables**: Konfigurasi aman via `.env` (tidak ter-push ke Git).

## Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MySQL (mysql2 driver) |
| Auth | JWT + bcryptjs |

## Cara Menjalankan
1. Clone repository
2. Instal dependensi: `npm install`
3. Salin konfigurasi: `cp .env.example .env` lalu sesuaikan kredensial MySQL
4. Jalankan migrasi: `npm run db:init`
5. Jalankan server: `npm start`

## API Endpoints

### Auth
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/api/auth/register` | Public | Registrasi user (owner/renter) |
| POST | `/api/auth/login` | Public | Login & mendapatkan JWT token |

### Items
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/api/items` | Authenticated | Lihat barang yang tersedia |
| POST | `/api/items` | Owner | Tambah barang baru |

### Rentals
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/api/rentals` | Renter | Sewa barang |
| POST | `/api/rentals/:id/complete` | Owner | Konfirmasi pengembalian barang |

## Struktur Proyek
```
├── app.js                  # Entry point
├── config/db.js            # Koneksi MySQL pool
├── middleware/
│   ├── authGuard.js        # JWT verification & role guard
│   └── errorHandler.js     # Global error handler
├── controllers/            # Request/Response handling
├── services/               # Business logic layer
├── routes/                 # Route definitions
├── utils/customError.js    # Custom error class
├── db_init.js              # Database schema migration
├── .env.example            # Template environment variables
└── test_api.js             # API integration test
```
