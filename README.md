# Eco-Share — Platform Penyewaan Elektronik Bekas

Nama : Muhammad Zidhan Fadillah
NIM : 411231016
Mata Kuliah : Pemrograman Fullstack

## Deskripsi

Aplikasi fullstack untuk penyewaan alat elektronik bekas. Terdiri dari **Backend API** (Node.js + Express) dan **Frontend Web Application** (Vue.js) yang mobile-responsive.

## Fitur Utama
- **Stateless Auth**: Menggunakan JWT untuk keamanan.
- **Role-Based Access (RBAC)**: Perbedaan hak akses antara Owner dan Renter via middleware guard.
- **Service Layer**: Logika bisnis terpisah dari controller (MVC + Service Layer pattern).
- **Database Transactions**: Menggunakan MySQL InnoDB dengan Row-Level Locking (`FOR UPDATE`) untuk mencegah double booking.
- **Global Error Handler**: Penanganan error yang tersentralisasi.
- **Environment Variables**: Konfigurasi aman via `.env` (tidak ter-push ke Git).
- **Frontend Vue.js**: SPA dengan Pinia state management, Vue Router navigation guard, dan unified error handling.
- **Mobile Responsive**: Desain responsif yang optimal di desktop dan mobile.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js |
| Backend Framework | Express.js v5 |
| Frontend Framework | Vue.js 3 (Composition API) |
| State Management | Pinia |
| Build Tool | Vite |
| HTTP Client | Axios |
| Router | Vue Router 4 |
| Database | MySQL (mysql2 driver) |
| Auth | JWT + bcryptjs |
| Testing | Vitest |

## Cara Menjalankan

### 1. Setup Backend
```bash
# Clone repository
# Install dependensi backend
npm install

# Salin konfigurasi
cp .env.example .env
# Sesuaikan kredensial MySQL di .env

# Jalankan migrasi database
npm run db:init

# Jalankan server backend (port 3000)
npm start
```

### 2. Setup Frontend
```bash
# Masuk ke folder frontend
cd frontend

# Install dependensi
npm install

# Salin konfigurasi
cp .env.example .env

# Jalankan development server (port 5173)
npm run dev
```

### 3. Akses Aplikasi
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

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
| GET | `/api/rentals` | Authenticated | Lihat riwayat penyewaan (role-based) |
| POST | `/api/rentals` | Renter | Sewa barang |
| POST | `/api/rentals/:id/complete` | Owner | Konfirmasi pengembalian barang |

## Struktur Proyek
```
├── app.js                      # Backend entry point
├── config/db.js                # Koneksi MySQL pool
├── middleware/
│   ├── authGuard.js            # JWT verification & role guard
│   └── errorHandler.js         # Global error handler
├── controllers/                # Request/Response handling
├── services/                   # Business logic layer
├── routes/                     # Route definitions
├── utils/customError.js        # Custom error class
├── db_init.js                  # Database schema migration
├── .env.example                # Template environment variables
├── test_api.js                 # API integration test
└── frontend/                   # Vue.js Frontend Application
    ├── src/
    │   ├── App.vue             # Root component
    │   ├── main.js             # Entry point
    │   ├── assets/main.css     # Design system & global styles
    │   ├── lib/axios.js        # Axios instance + interceptors
    │   ├── router/index.js     # Vue Router + navigation guards
    │   ├── stores/
    │   │   ├── auth.js         # Auth state management
    │   │   └── toast.js        # Toast notification state
    │   ├── components/
    │   │   ├── AppNavbar.vue   # Responsive navigation bar
    │   │   ├── AppToast.vue    # Toast notification system
    │   │   ├── ItemCard.vue    # Item display card
    │   │   ├── RentalCard.vue  # Rental display card
    │   │   └── LoadingSpinner.vue
    │   └── views/
    │       ├── LoginView.vue
    │       ├── RegisterView.vue
    │       ├── DashboardView.vue
    │       ├── ItemsView.vue
    │       ├── CreateItemView.vue
    │       ├── RentalsView.vue
    │       └── CreateRentalView.vue
    ├── .env.example
    └── index.html
```

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecoshare_db
DB_PORT=3306
JWT_SECRET=super_secret_eco_share_key_2026
```

### Frontend (frontend/.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing

### Backend Test
```bash
npm test
```

### Frontend Test
```bash
cd frontend
npx vitest run
```

### Build Production
```bash
cd frontend
npm run build
```
