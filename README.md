# 🛒 E-Commerce Application  
**React (Vite) + Supabase Cloud**

A **cloud-native e-commerce application** built with **React (JSX)** on the frontend and **Supabase Cloud** as the backend (Authentication, Database, Row Level Security, Storage).

---

## 🧠 Architecture Overview

```
React Frontend
|
| supabase-js (HTTPS + JWT)
|
Supabase Cloud
(Auth + Postgres + RLS + Storage)

```

- ❌ No traditional backend server (Express / Node)
- ❌ No manual REST APIs
- ✅ Supabase Cloud acts as the backend
- ✅ Security enforced at database level using RLS

---

## 📁 Project Structure

```

ecommerce-app/
│
├── frontend/ # React (Vite + JSX)
├── backend/ # Supabase backend definition
│
├── .env.example # Environment variable template
├── .gitignore
└── README.md
```


---

## 🎨 Frontend Structure

```
frontend/
│
├── public/
│
├── src/
│ ├── app/
│ │ ├── App.jsx
│ │ ├── routes.jsx
│ │ └── providers.jsx
│ │
│ ├── assets/
│ ├── components/
│ ├── config/
│ │ ├── constants.js
│ │ ├── env.js
│ │ └── roles.js
│ │
│ ├── features/
│ ├── hooks/
│ ├── lib/
│ │ ├── supabase.js
│ │ └── queryClient.js
│ │
│ ├── middlewares/
│ │ └── ProtectedRoute.jsx
│ │
│ ├── services/
│ ├── store/
│ ├── styles/
│ │ └── index.css
│ ├── types/
│ ├── utils/
│ │
│ ├── App.jsx
│ └── main.jsx
│
├── .env.example
├── .env # ❌ NOT COMMITTED
├── package.json
├── vite.config.js
└── README.md

```


---

## 📦 Frontend Packages & Installation

### 🔹 Required Packages

These are the **core dependencies** used in the frontend:

| Package | Purpose |
|------|--------|
| `react` | UI library |
| `react-dom` | React DOM rendering |
| `react-router-dom` | Routing |
| `@supabase/supabase-js` | Supabase client |
| `@tanstack/react-query` | Server-state management |
| `zustand` | Global state (cart, user, etc.) |
| `clsx` | Conditional class names |

---

### 🔹 Install Frontend Packages

Run these commands **inside the `frontend` folder**:

```bash
cd frontend
npm install

```
Install additional required packages:

```bash
npm install react-router-dom @supabase/supabase-js @tanstack/react-query zustand clsx

Optional (recommended for code quality):

npm install -D eslint prettier

```
---

## 🗄️ Backend Structure (Supabase Cloud)

```
backend/
│
├── supabase/                     # Supabase CLI workspace
│   ├── config.toml
│   ├── migrations/               # ✅ AUTO-SYNC SOURCE OF TRUTH
│   │   ├── 20240201_init.sql
│   │   ├── 20240202_profiles.sql
│   │   ├── 20240203_products.sql
│   │   ├── 20240204_cart_items.sql
│   │   ├── 20240205_orders.sql
│   │   └── 20240206_order_items.sql
│   │
│   └── seed.sql
│
├── database/                     # Reference SQL (not auto-run)
├── policies/                     # RLS reference
├── docs/                         # Backend documentation
└── README.md

```
---
## 🔐 Environment Variables

### .env (DO NOT COMMIT)


### .env.example (COMMIT THIS)

Used to document required variables.

### Root .env.example

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```


### Frontend .env.example
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```


---

## 🔁 Backend Development Workflow

```
1. Create migration
2. Write SQL
3. Push to Supabase Cloud
4. Commit to Git

```

## 📥 Download & Setup Guide

```
🔹 Prerequisites
    - Node.js 18+
    - Git
    - Supabase account
```
##  Clone Repository

```bash
git clone https://github.com/PramodBasavarajMenasi/ecommerce-app.git

cd ecommerce-app
```

🔹 Frontend Setup

```
cd frontend
npm install
cp .env.example .env
npm run dev
```
🔹 Backend Setup (Supabase Cloud)
```
cd backend
npx supabase login
npx supabase link
npx supabase db push
```

## 👥 Contribution Guidelines

- Feature-based development

- Backend changes via migrations only

- Do not edit production DB manually

- Secrets must never be committed


## 📌 Notes

- .env files are intentionally ignored

- Empty folders may contain .gitkeep

- Supabase Dashboard should not be edited directly when using migrations
    

