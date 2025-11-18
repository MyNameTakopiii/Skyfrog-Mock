# Implementation Plan

## ✅ Backend (API & Database) - COMPLETED

### 1. Database Setup

- [x] Set up Drizzle ORM schema (server/db/schema.ts)
  - Users table with authentication fields
  - Products table with inventory management
  - Orders table with payment tracking
- [x] Configure database connection (server/db/index.ts)
- [x] Create Drizzle configuration (drizzle.config.ts)

### 2. TypeScript Types

- [x] Define shared types (types/index.ts)
  - User, Product, Order interfaces
  - OCRData and DTO types
  - API response types

### 3. Server Utilities

- [x] Cloudinary image upload (server/utils/cloudinary.ts)
- [x] PromptPay QR generator (server/utils/promptpay.ts)
- [x] OCR text extraction (server/utils/ocr.ts)
- [x] JWT token management (server/utils/jwt.ts)
- [x] Error handling helpers (server/utils/errors.ts)

### 4. Authentication API

- [x] POST /api/auth/register - User registration
- [x] POST /api/auth/login - User login with JWT
- [x] GET /api/auth/me - Get current user
- [x] Authentication middleware (server/middleware/auth.ts)

### 5. Product Management API

- [x] GET /api/products - List all products
- [x] GET /api/products/[id] - Get single product
- [x] POST /api/products - Create product (admin only)
- [x] PUT /api/products/[id] - Update product (admin only)
- [x] DELETE /api/products/[id] - Delete product (admin only)

### 6. Order & Payment API

- [x] POST /api/payment/qr - Generate PromptPay QR code
- [x] POST /api/upload/image - Upload image to Cloudinary
- [x] POST /api/orders/create - Create order (guest allowed)
- [x] GET /api/orders - List all orders with filters (admin only)
- [x] GET /api/orders/[id] - Get single order details
- [x] POST /api/payment/ocr - Process payment slip OCR
- [x] POST /api/orders/[id]/verify - Verify/reject order (admin only)

---

## 🚧 Frontend (UI & Pages) - IN PROGRESS

### 7. UI Components (app/components/ui/)

- [x] Button.vue
  - Variants: primary, secondary, danger
  - Sizes: sm, md, lg
  - Loading state with spinner

- [x] Input.vue
  - Types: text, email, password, number
  - Validation states (error, success)
  - Error message display
  -

- [x] Modal.vue
  - Backdrop with click-to-close
  - Header, body, footer slots
  - Close button
  -

- [x] LoadingSpinner.vue
  - Centered overlay
  - Spinner animation
  - Tailwind CSS styling

###-8. Layout Co
mponents (app/components/layout/)

- [x] Navbar.vue
  - Logo and navigation links
  - Conditional auth buttons (login/register vs logout)
  - Responsive mobile menu

- [x] Footer.vue
  - Copyright and links
  - Responsive design

- [x] Update app.vue
  - Integrate Navbar and Footer

  - NuxtPage for routing

###-9. Product Compon
ents (app/components/product/)

- [x] ProductCard.vue
  - Display image, name, price
  - "View Details" button
  - Responsive design
  -

- [x] ProductGrid.vue
  - Accept products array prop
  - Render ProductCard in grid
  - Empty state handling
  -

- [x] ProductForm.vue
  - Fields: name, description, price, stock, image
  - Image upload with preview
  - Form validation
  - Create/edit modes

### 10. Composables (app/composables/)

- [x] useAuth.ts
  - login(), logout(), register()
  - User state management
  - Error handling

- [x] useProducts.ts
  - fetchProducts(), fetchProduct()
  - createProduct(), updateProduct(), deleteProduct()
  - Loading states

- [x] useOrders.ts
  - createOrder(), fetchOrders(), fetchOrder()
  - verifyOrder()
  - Loading states

### 11. Public Pages (app/pages/)

- [x] index.vue - Home/Product Listing
  - Fetch and display all products
  - ProductGrid component
  - Loading spinner
  - Empty state
  -

- [x] products/[id].vue - Product Detail
  - Fetch product by ID
  - Display full product details
  - "Buy Now" button
  - Payment modal integration
  -

- [x] Payment Modal (in product detail)
  - Display PromptPay QR code
  - Order details summary
  - Payment slip upload
  - Success message

###-12. Authentica
tion Pages (app/pages/auth/)

- [x] register.vue
  - Form: firstName, lastName, email, password
  - Form validation
  - Redirect to login on success
  - Error messages

- [x] login.vue
  - Form: email, password
  - Redirect to admin on success
  - Error messages

###-13. Admin Pages (app/pa
ges/admin/)

- [x] index.vue - Dashboard
  - Protected route
  - Welcome message
  - Navigation to products/orders

- [x] products.vue - Product Management
  - Protected route
  - Products table with edit/delete
  - "Create Product" button

  - ProductForm modal
  - Delete confirmation

- [x] orders.vue - Order Verification
  - Protected route
  - Orders table with filters
  - Payment slip thumbnails
  - Verification modal with OCR data
  - Approve/reject buttons

---

## 📋 Configuration & Setup

### 14. Environment Configuration

- [x] Create .env.example
  - DATABASE_URL
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - PROMPTPAY_PHONE
  - JWT_SECRET
  -

- [x] Verify .env in .gitignore

### 15. Database Initialization

- [-] Drizzle configuration exist
  s
- [x] Generate and run migrations

- [x] Create seed data script (optional)

---

## 📝 Notes

**Current Status:**

- Backend API is fully functional and tested
- Database schema is complete
- All authentication and authorization working
- Ready to build frontend UI

**Next Steps:**

1. Start with UI components (Button, Input, Modal)
2. Build layout components (Navbar, Footer)
3. Create composables for API integration
4. Build public pages (home, product detail)
5. Build admin pages (dashboard, products, orders)
