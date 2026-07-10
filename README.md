# BookStore – MERN Stack Online Book Shopping System

A beautiful, fully-functional, intermediate college-level full-stack **Online Book Shopping System** developed using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js).

This project incorporates user authentication, dynamic catalog search/filtering/sorting, database-backed shopping cart states, Cash on Delivery (COD) checkouts, and a secure administrator control panel.

---

## 🌐 Live Demo

**Application:** https://bookstore-qhf0.onrender.com/

> **Note:** This application is deployed on **Render's Free Tier**. If the service has been idle, the first request may take **20–30 seconds** (or occasionally up to a minute) while Render wakes up the server. After the initial startup, the application responds normally.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | `user@gmail.com` | `user123` |
| Admin | `admin@gmail.com` | `admin123` |

---

## 🚀 Key Features

### 👤 Customer Features
- **Account Management:** User registration, secure login with bcrypt password encryption, profile modifications, and password reset.
- **Interactive Catalog:** View all books, search dynamically (by Title, Author, or Genre), filter by Genre or Price Range, and sort by Price (Low to High, High to Low) or Rating.
- **Detailed Book View:** Synopsis, genre tags, and real-time stock indicator updates.
- **Cart Management:** Persistent shopping cart (synced with database when logged in; cached in guest `localStorage` when offline).
- **Cash on Delivery Checkout:** Direct checkout with verified delivery detail fields (pincode, mobile, address).
- **Order Tracking:** Track order stages (Pending &rarr; Confirmed &rarr; Shipped &rarr; Delivered) with invoice totals.

### 🔑 Administrator Features
- **Summary Dashboard:** Visual card metrics displaying Total Users, Total Books Cataloged, Total Orders Received, and Cumulative Sales Revenue.
- **Inventory CRUD:** Create, read, update, and delete books in real-time, modify stock limits, adjust prices, and upload cover URLs.
- **Order Management:** View all customer orders, access shipping details, and modify status timelines using dropdown selectors.

---

## 🛠️ Technology Stack

- **Frontend:** React.js (Vite), React Router DOM (v6), Axios, Bootstrap 5, Bootstrap Icons, React Hot Toast.
- **Backend:** Node.js, Express.js, JWT (JSON Web Token), bcryptjs, Morgan logs.
- **Database:** MongoDB, Mongoose ODM.

---

## 📁 Folder Structure

```text
BookStore/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Spinner, ProtectedRoute
│   │   ├── context/        # Global Auth and Cart State contexts
│   │   ├── pages/          # Home, Login, Catalog, Checkout, Admin Panels...
│   │   ├── services/       # Central Axios interceptor config (api.js)
│   │   ├── App.jsx         # Routes configuration
│   │   └── main.jsx        # App mounting and CSS imports
│   └── index.html
│
├── server/                 # Express Backend
│   ├── config/             # DB connection helper
│   ├── controllers/        # Controllers (MVC Architecture)
│   ├── middleware/         # JWT Verification, Admin Checkers
│   ├── models/             # Mongoose Schemas (User, Book, Cart, Order)
│   ├── routes/             # Route pathways
│   ├── utils/              # Seeding script (seed.js)
│   └── server.js           # Server entrance point
│
├── package.json            # Workspace manager scripts
└── README.md               # Documentation
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed locally.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running on port `27017` locally.

### 2. Configure Environment Variables
Create a file named `.env` inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookstore
JWT_SECRET=supersecretjwtkeyforcollegebookstoreproject12345
NODE_ENV=development
```

### 3. Install Dependencies
Run the installation command in the **root** folder:
```bash
npm run install-all
```
*This command executes standard package installs inside both the `server/` and `client/` directories.*

### 4. Seed the Database
Populate MongoDB with default accounts and 33 pre-loaded books across 10 categories:
```bash
npm run seed
```

### 5. Launch the Application

Start both the backend server and React dev server concurrently from the root directory:

```bash
npm run dev
```

**Local Development**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

**Production Deployment**

- Live Demo: https://bookstore-qhf0.onrender.com/
```

## 🔑 Demo Login Accounts

Use the following pre-registered credentials to demonstrate or evaluate the system:

| Account Type | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `user@gmail.com` | `user123` |
| **Administrator** | `admin@gmail.com` | `admin123` |

*Note: You can also use the **Quick Autofill buttons** on the Login page to fill these credentials automatically.*


![MERN](https://img.shields.io/badge/Stack-MERN-3FA037)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![License](https://img.shields.io/badge/License-MIT-yellow)
