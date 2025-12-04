# 🛍️ E-Commerce Platform - ระบบประกาศขายสินค้า

ระบบ E-Commerce แบบ Full-Stack สำหรับพ่อค้าในการประกาศขายสินค้า พร้อมระบบชำระเงินผ่าน PromptPay QR Code และการตรวจสอบสลิปด้วย OCR

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ ระบบ Login/Register สำหรับพ่อค้า
- ✅ JWT Authentication
- ✅ การจำกัดสิทธิ์ Public/Private routes
- ✅ Middleware protection

### 📦 Product Management (CRUD)

- ✅ เพิ่มสินค้าใหม่ (Create)
- ✅ แสดงรายการสินค้า (Read)
- ✅ แก้ไขสินค้า (Update)
- ✅ ลบสินค้า (Delete)
- ✅ ค้นหาและกรองสินค้า (Search)
- ✅ อัปโหลดรูปภาพสินค้า (Cloudinary + Local fallback)
- ✅ พ่อค้าแต่ละคนเห็นเฉพาะสินค้าของตัวเอง

### 💳 Payment System

- ✅ สร้าง PromptPay QR Code (ใช้เบอร์โทรของพ่อค้าแต่ละคน)
- ✅ อัปโหลดสลิปการโอนเงิน
- ✅ OCR สำหรับตรวจสอบสลิป (Tesseract.js)

### 📊 Order Management

- ✅ ดูรายการ Orders
- ✅ กรอง Orders ตามสถานะ
- ✅ ยืนยัน/ปฏิเสธการชำระเงิน

## 🚀 Tech Stack

### Frontend

- **Nuxt 3** - Vue.js Framework
- **Vue 3** - Composition API
- **TypeScript** - Type Safety
- **Tailwind CSS v4** - Styling
- **Nuxt UI** - UI Components

### Backend

- **Nuxt Server API** - RESTful API
- **Drizzle ORM** - Database ORM
- **PostgreSQL (NeonDB)** - Database
- **JWT** - Authentication
- **Zod** - Validation

### Services

- **Cloudinary** - Image Upload (with local fallback)
- **PromptPay QR** - Payment QR Generation
- **Tesseract.js** - OCR for payment slip verification

## 📋 Prerequisites

- **Bun** >= 1.0.0 (หรือ Node.js >= 18)
- **PostgreSQL Database** (NeonDB recommended)
- **Cloudinary Account** (optional - มี local fallback)

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd mock-test
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Variables

สร้างไฟล์ `.env` และเพิ่ม:

```env
# Database (NeonDB PostgreSQL)
DATABASE_URL=postgresql://your-neon-connection-string

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Cloudinary (Optional - มี local fallback)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Database Setup

```bash
# Push schema to database
bunx drizzle-kit push

# Seed sample data
bun run db:seed
```

### 5. Run Development Server

```bash
bun run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 🧪 Sample Credentials

สำหรับทดสอบระบบ (หลังจากรัน `bun run db:seed`):

### Seller Account 1

- **Email:** `john@example.com`
- **Password:** `password123`
- **Phone:** 0812345678

### Seller Account 2

- **Email:** `jane@example.com`
- **Password:** `password123`
- **Phone:** 0823456789

## 📁 Project Structure

```
.
├── app/                      # Frontend (Nuxt App)
│   ├── assets/              # CSS, Images
│   ├── components/          # Vue Components
│   │   ├── layout/         # Layout components
│   │   ├── product/        # Product-related components
│   │   └── ui/             # UI components
│   ├── composables/         # Vue Composables
│   │   └── query/          # API query functions
│   ├── middleware/          # Route middleware
│   ├── pages/              # Pages (Auto-routing)
│   │   ├── admin/          # Admin pages (Protected)
│   │   ├── auth/           # Auth pages
│   │   └── products/       # Product pages
│   └── utils/              # Utility functions
│
├── server/                   # Backend (Nuxt Server)
│   ├── api/                # API endpoints
│   │   ├── auth/           # Authentication APIs
│   │   ├── orders/         # Order APIs
│   │   ├── payment/        # Payment APIs
│   │   ├── products/       # Product APIs
│   │   └── upload/         # Upload APIs
│   ├── db/                 # Database
│   │   ├── schema.ts       # Database schema
│   │   ├── seed.ts         # Seed data
│   │   └── index.ts        # DB connection
│   ├── middleware/         # Server middleware
│   └── utils/              # Server utilities
│
├── types/                    # TypeScript types
└── scripts/                  # Utility scripts
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new seller
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products (public)
- `GET /api/products/me` - Get seller's products (protected)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders

- `GET /api/orders` - Get all orders (protected)
- `POST /api/orders/create` - Create order (public)
- `POST /api/orders/:id/verify` - Verify payment (protected)

### Payment

- `POST /api/payment/qr` - Generate PromptPay QR
- `POST /api/payment/ocr` - OCR payment slip

### Upload

- `POST /api/upload/image` - Upload image

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - Import repository
   - ตั้งค่า:
     - **Framework Preset:** Nuxt.js
     - **Build Command:** `bun run build`
     - **Output Directory:** `.output/public`
     - **Install Command:** `bun install`

3. **Add Environment Variables**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

4. **Deploy!**

### Database Migration (After Deploy)

```bash
# Push schema to production database
bunx drizzle-kit push

# Seed production data
bun run db:seed
```

## 📝 Available Scripts

```bash
# Development
bun run dev              # Start dev server

# Build
bun run build            # Build for production
bun run preview          # Preview production build

# Database
bun run db:push          # Push schema to database
bun run db:generate      # Generate migrations
bun run db:seed          # Seed sample data
bun run db:studio        # Open Drizzle Studio

# Code Quality
bun run format           # Format code with Prettier
```

## 🎯 Features Checklist

### ข้อกำหนดตามโจทย์

- ✅ **1. การจำกัดสิทธิ์การเข้าถึง**
  - ✅ Public routes (ไม่ต้อง login)
  - ✅ Private routes (ต้อง login)
  - ✅ Middleware authentication

- ✅ **2. Web API/Backend**
  - ✅ RESTful API (TypeScript)
  - ✅ JWT Authentication

- ✅ **3. จัดการฐานข้อมูล (PostgreSQL)**
  - ✅ 3.1 ค้นหาข้อมูล (Search)
  - ✅ 3.2 เพิ่มข้อมูลใหม่ (Create)
  - ✅ 3.3 แสดงผลข้อมูล (Read)
  - ✅ 3.4 แก้ไขข้อมูล (Update)
  - ✅ 3.5 ลบข้อมูล (Delete)
  - ✅ 3.6 อัปโหลดไฟล์ (Upload)

### การส่งงาน

- ✅ **1. Source Code** - Frontend + API
- ✅ **2. Database Scripts** - Schema + Seed
- ✅ **3. Deploy** - Ready for Vercel/Netlify

## 🐛 Troubleshooting

### Database Connection Error

```bash
# ตรวจสอบ DATABASE_URL ใน .env
# ตรวจสอบว่า NeonDB database ทำงานอยู่
```

### Build Error

```bash
# ลบ node_modules และ install ใหม่
rm -rf node_modules .nuxt .output
bun install
bun run build
```

### Image Upload ไม่ทำงาน

```bash
# ตรวจสอบ Cloudinary credentials
# หรือใช้ local fallback (ไม่ต้องตั้งค่า Cloudinary)
```

## 📄 License

MIT License

## 👨‍💻 Author

Developed for Web Application Development Course

---

**🎉 Happy Coding!**
