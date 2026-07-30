<div align="center">

<img src="https://img.shields.io/badge/FoodSpot-Gourmet%20Delivery-ff385c?style=for-the-badge&logo=react&logoColor=white" alt="FoodSpot" />

# 🍽️ FoodSpot — Full-Stack Food Delivery Platform

**A production-grade food delivery web application with separate Admin, Delivery, and Customer portals, Stripe payment integration, and Google OAuth.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-008CDD?style=flat-square&logo=stripe)](https://stripe.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Google%20OAuth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Portal Access](#-portal-access)
- [API Reference](#-api-reference)
- [Stripe Integration](#-stripe-integration)
- [Google OAuth Setup](#-google-oauth-setup)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)

---

## 🌟 Overview

FoodSpot is a fully dynamic food delivery platform built with the **MERN stack**. It features three completely separate role-based portals — **Customer**, **Admin**, and **Delivery Partner** — each with dedicated authentication and functionality. Customers can browse 50+ Indian dishes, place orders with **Cash on Delivery** or **Stripe online payment**, and track their order in real time. The platform is mobile-responsive and follows modern UI/UX principles with glassmorphism, micro-animations, and a curated dark-mode design system.

---

## ✨ Features

### 👤 Customer Portal
- 🏠 **Dynamic Home Page** — Curated hero section with featured dishes and promotional banners
- 🍽️ **Full Menu** — 50+ Indian food items organized across 8 categories (Curries, Tandoori, South Indian, Street Food, Desserts, Drinks, Salads, Thali)
- 🔍 **Real-time Search** — Search by dish name, category, or ingredient
- 🛒 **Smart Cart** — Add/remove items with instant quantity updates
- 📦 **Checkout Flow** — Auto-filled user details, delivery address form, payment method selection
- 💳 **Stripe Payment** — Redirect to Stripe hosted checkout (cards, UPI, netbanking)
- 📍 **Order Tracking** — 4-stage visual tracker (Placed → Verified → Out for Delivery → Delivered)
- 🔐 **Authentication** — Email/password login + **Google OAuth** via Firebase
- 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile

### 🛡️ Admin Portal (`/admin-login`)
- 📊 **Dashboard** — Live stats (total orders, revenue, pending, delivered)
- 📋 **Order Management** — View all orders, change status, assign delivery partners
- 🍕 **Menu Management** — Add, edit, and delete food items with category & price control
- 👥 **Delivery Assignment** — Assign any order to available delivery partners
- 🔒 **Protected Route** — Separate login; customers cannot access or even see this portal

### 🚴 Delivery Partner Portal (`/delivery-login`)
- 🔑 **Partner ID Login** — Unique ID + password authentication (no shared admin credentials)
- 📦 **My Orders** — View only orders assigned to this partner
- 🔄 **Status Updates** — One-tap lifecycle updates (Pick Up → In Transit → Delivered)
- 📞 **Quick Actions** — Simulated customer call and map navigation buttons
- 🔒 **Protected Route** — Fully isolated from customer and admin sessions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Vanilla CSS — Custom Design System with CSS Variables |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Icons** | React Icons (Bi, Fa, Md sets) |
| **Notifications** | React Toastify |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) + bcrypt |
| **Google OAuth** | Firebase Auth (signInWithPopup) |
| **Payment** | Stripe Checkout Sessions |
| **Media Storage** | Cloudinary |
| **File Uploads** | Multer |
| **Validation** | Validator.js |

---

## 📁 Project Structure

```
food-del/
├── backend/
│   ├── config/
│   │   ├── mongodb.js          # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary setup
│   ├── controllers/
│   │   ├── userControllers.js  # Login, register, Google OAuth, admin auth
│   │   ├── productControllers.js
│   │   ├── orderControllers.js # COD + Stripe orders, status updates
│   │   └── deliveryControllers.js # Delivery partner auth
│   ├── middleware/
│   │   ├── auth.js             # Customer JWT middleware
│   │   ├── adminAuth.js        # Admin JWT middleware
│   │   └── multer.js           # File upload middleware
│   ├── models/
│   │   ├── userModels.js
│   │   ├── productModels.js
│   │   └── orderModel.js       # Order schema with payment & delivery tracking
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── deliveryRoutes.js
│   ├── server.js
│   └── .env
│
└── frontend/
    └── src/
        ├── assets/             # Food images, logos
        ├── components/
        │   ├── Navbar/         # Two-row professional navbar (customer-only)
        │   ├── Footer/
        │   ├── Home/           # Hero + featured dishes
        │   ├── FoodCollection/ # Food item grid
        │   ├── CartTotal/
        │   └── ProtectedRoute/ # Role-based route guard
        ├── config/
        │   └── firebase.js     # Firebase + GoogleAuthProvider config
        ├── context/
        │   └── FoodContext.jsx # Global state (cart, user, food list)
        └── pages/
            ├── AdminLogin/     # Standalone admin login (dark theme)
            ├── Admin/          # Full admin dashboard (protected)
            ├── DeliveryLogin/  # Delivery partner login (green theme)
            ├── Delivery/       # Delivery portal (protected)
            ├── Login/          # Customer login + Google OAuth
            ├── Menu/           # Full food catalog (50+ items)
            ├── Cart/
            ├── Checkout/       # Address + Stripe / COD payment
            ├── Order/          # Order tracking timeline
            ├── FoodDetail/     # Individual dish detail page
            ├── About/
            └── Contact/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- A Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/foodspot.git
cd foodspot
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create your `.env` file (see [Environment Variables](#-environment-variables) below), then:

```bash
npm run server
# Server starts at http://localhost:4000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
# App starts at http://localhost:5173
```

### 4. Run Both Together (Root)

```bash
# From root /food-del directory
npm run start        # starts backend
# In a second terminal:
npm run frontend     # starts frontend
```

---

## 🔧 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017

# Cloudinary (for product image uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINAY_SECRET_KEY=your_api_secret

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Admin Credentials
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

# Stripe (get from stripe.com → Developers → API Keys)
STRIPE_SECRET_KEY=sk_test_your_key_here

# Frontend URL (for Stripe redirect)
FRONTEND_URL=http://localhost:5173

# Delivery Partners (JSON array stored in env)
DELIVERY_PARTNERS=[{"id":"DB-101","name":"Alex Rivera","phone":"+91 98765 43210","vehicle":"Honda Activa","password":"alex@delivery"},{"id":"DB-102","name":"Rahul Sharma","phone":"+91 98123 45678","vehicle":"TVS NTORQ","password":"rahul@delivery"},{"id":"DB-103","name":"Sameer Khan","phone":"+91 99555 12345","vehicle":"Royal Enfield","password":"sameer@delivery"}]
```

For the **frontend**, update `src/config/firebase.js` with your Firebase project config:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:yourappid"
};
```

---

## 🔑 Portal Access

| Portal | URL | Credentials |
|---|---|---|
| 🌐 Customer App | `http://localhost:5173/` | Sign up or use Google |
| 🛡️ Admin Dashboard | `http://localhost:5173/admin-login` | `admin@gmail.com` / `admin123` |
| 🚴 Delivery Partner | `http://localhost:5173/delivery-login` | `DB-101` / `alex@delivery` |
| 🚴 Delivery Partner | `http://localhost:5173/delivery-login` | `DB-102` / `rahul@delivery` |
| 🚴 Delivery Partner | `http://localhost:5173/delivery-login` | `DB-103` / `sameer@delivery` |

> **Security**: The customer Navbar has zero links to `/admin` or `/delivery`. Direct URL access to protected routes auto-redirects to the appropriate login page.

---

## 📡 API Reference

### User Routes — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | None | Register new customer |
| `POST` | `/login` | None | Customer email/password login |
| `POST` | `/admin` | None | Admin login → returns admin JWT |
| `POST` | `/google-login` | None | Google OAuth → creates/finds user |

### Order Routes — `/api/order`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/place` | Customer JWT | Place a COD order |
| `POST` | `/stripe` | Customer JWT | Create Stripe Checkout Session |
| `POST` | `/verifyStripe` | None | Verify Stripe payment (webhook) |
| `POST` | `/userorders` | Customer JWT | Get current user's orders |
| `GET` | `/list` | Admin JWT | Get all orders |
| `POST` | `/status` | Admin JWT | Update order status |
| `POST` | `/assign` | Admin JWT | Assign delivery partner to order |

### Delivery Routes — `/api/delivery`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | None | Delivery partner login |
| `GET` | `/orders` | Delivery JWT | Get orders assigned to this partner |
| `POST` | `/updatestatus` | Delivery JWT | Update delivery status |

### Product Routes — `/api/product`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/add` | Admin JWT | Add new food item |
| `GET` | `/list` | None | Get all food items |
| `POST` | `/remove` | Admin JWT | Delete a food item |

---

## 💳 Stripe Integration

FoodSpot uses **Stripe Checkout Sessions** (hosted payment page) for a secure, PCI-compliant payment flow.

### Flow
```
Customer → Selects "Pay Online" → Fills address → Clicks "Proceed to Payment"
  → Backend creates a Stripe Checkout Session
  → Customer redirected to Stripe hosted page
  → Card / UPI / Netbanking payment processed
  → Stripe redirects back to /orders?success=true
  → Order marked as paid in MongoDB
```

### Test Cards

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | ✅ Payment success |
| `4000 0000 0000 9995` | ❌ Card declined |
| `4000 0025 0000 3155` | 🔐 3D Secure required |

Use any future expiry date and any 3-digit CVV.

---

## 🔐 Google OAuth Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project → **Authentication** → **Sign-in method** → Enable **Google**
3. Go to **Project Settings** → **Your apps** → **Web app** → Copy the config
4. Paste config into `frontend/src/config/firebase.js`
5. Add your domain to **Authorized domains** in Firebase Console

---

## 🗺️ Roadmap

- [x] Customer portal with 50+ Indian food items
- [x] Admin dashboard with order & menu management
- [x] Delivery partner portal with live order assignment
- [x] Stripe online payment integration
- [x] Google OAuth sign-in
- [x] Role-based authentication & protected routes
- [x] Auto-filled checkout for logged-in users
- [x] 4-stage order tracking timeline
- [ ] Push notifications for order updates
- [ ] Customer reviews & ratings system
- [ ] Coupon / discount code support
- [ ] Real-time order status via WebSockets
- [ ] Mobile app (React Native)
- [ ] Razorpay as alternative payment gateway (India)

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with ❤️ by the FoodSpot Team

⭐ **Star this repo** if you found it helpful!

</div>