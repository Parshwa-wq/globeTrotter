# GlobeTrotter 🌍

> A full-stack travel itinerary & budget management platform built for the **Odoo Hackathon 2026**. Plan stops, track expenses, share itineraries, and visualize routes — all wrapped in a premium **Cyber-Tactical** dark UI.

---

## 📸 Overview

GlobeTrotter is a complete travel planning application where authenticated users can create multi-stop trip itineraries, attach categorized activities to each stop, track multi-currency expenses, generate public share links, and visualize travel routes on an interactive map — with a full admin console for platform management.

---

## ✨ Feature Breakdown

### 🔐 Authentication & User Management
- **JWT-based Auth** — Secure login and signup with `bcryptjs` password hashing and `jsonwebtoken` session tokens.
- **Role-Based Access Control** — Two roles: `user` (default) and `admin`. Admin routes are gated server-side and client-side.
- **User Settings** — Update display name, language preference, default origin city, and UI theme (dark/light).
- **Profile Management** — Per-user profile photo and customizable preferences persisted in the database.

### 🗺️ Trip Management
- **Create Trips** — Define a trip with a title, description, date range, cover image URL, and status (`draft`, `planned`, `ongoing`, `completed`).
- **Dashboard** — Overview of all user trips with stats: active trip count, total stops, total expense volume.
- **Trip List** — Browse all personal trips with card-based UI, sorted by creation date.
- **Edit & Delete Trips** — Full CRUD; deleting a trip cascades to all stops, activities, and expenses via foreign key constraints.
- **Trip Status Lifecycle** — Trips move through `draft → planned → ongoing → completed` states.

### 📍 Stop Management
- **Multi-Stop Itineraries** — Each trip contains ordered "stops" (cities/destinations) with arrival and departure dates.
- **Drag-and-Drop Ordering** — Stops are sorted by `sort_order`, enabling manual reordering in the itinerary workspace.
- **Date Validation** — DB-level `CHECK` constraint enforces `departure_date >= arrival_date`.

### 🎯 Activity Management
- **Per-Stop Activities** — Each stop contains activities with a title, description, time range (`start_time`, `end_time`), and category.
- **9 Activity Categories** — `sightseeing`, `food`, `adventure`, `shopping`, `transport`, `accommodation`, `nightlife`, `culture`, `other`.
- **Ownership Verification** — Every mutation (add/edit/delete) performs a DB JOIN to verify the requesting user owns the parent trip.
- **Sort Order** — Activities within a stop are ordered by `sort_order` then `start_time`.

### 💸 Expense Tracking
- **Activity-Level Expenses** — Log individual cost items directly against any activity.
- **Multi-Currency Support** — Expenses tracked in `INR`, `USD`, `EUR`, or `GBP`.
- **Budget Page** — Dedicated `/trips/:id/budget` page with aggregated spend breakdowns by stop and activity using `recharts` visualizations.
- **Ownership Chain Verification** — Expense mutations walk the full `expenses → activities → stops → trips` join chain to confirm authorization.

### 🔗 Public Trip Sharing
- **UUID Share Links** — Generate a unique, permanent, shareable link for any trip (e.g., `/share/abc-123-uuid`).
- **Idempotent Generation** — Re-requesting a share link returns the existing active `share_id` instead of creating duplicates.
- **Public Read-Only View** — Unauthenticated users can view the full itinerary (stops + activities) at the public share URL — no login required.
- **1-Click Trip Cloning** — Authenticated users viewing a shared trip can clone the entire itinerary (trip + all stops + all activities) into their own account with a single click.

### 🗺️ Route Visualization
- **Interactive Map** — Powered by `react-leaflet` (Leaflet.js), displays trip stops as markers on an interactive map.
- **Python Route Scraper** — A Node.js `child_process` spawns a Python script (`route_scraper.py`) to generate transit route data between an origin and destination, with anomaly detection (e.g., cars over oceans).
- **Persistent Route Storage** — Generated routes are saved to a `trip_routes` table with full JSON station data, and can be re-fetched or deleted.
- **Transport Mode Support** — Routes support multiple modes passed as query parameters.

### 🛡️ Admin Console (`/admin`)
- **Platform Stats Dashboard** — Total users, trips, active trips, concluded trips, total stops, and aggregate expense volume.
- **Top Destinations Chart** — Bar chart of the 5 most popular stop destinations across all trips (powered by `recharts`).
- **User Management Table** — View all registered users with their trip count and total spend.
- **Role Promotion/Demotion** — Admins can change any user's role between `user` and `admin` (cannot modify own role).
- **User Deletion** — Hard-delete users (cascades to all their trips/data). Cannot self-delete.
- **Self-Protection** — Server enforces that admins cannot demote or delete themselves.

### 🎨 UI & Design System
- **Cyber-Tactical Aesthetic** — High-contrast neon accents on deep dark backgrounds; monospace typography for terminal feel.
- **Light/Dark Theme Toggle** — User-selectable theme persisted in `localStorage`, applied via CSS class on `document.body`.
- **Topographic Background** — Animated SVG mesh background component (`TopographicBackground.jsx`) with subtle motion.
- **Framer Motion Animations** — Page transitions, card entrances, and micro-interaction animations on all interactive elements.
- **Glassmorphism Cards** — Blur overlays and translucent surfaces across dashboard and detail pages.
- **Pill Navigation** — Compact `PillNavbar.jsx` for contextual sub-navigation within trip views.
- **Skeleton Loaders** — `Skeleton.jsx` placeholder components for all async data fetching states.
- **Confirm Modals** — `ConfirmModal.jsx` for all destructive actions (delete trip, delete user, etc.).
- **Recharts Integration** — Expense pie/bar charts on the budget page and admin analytics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (Vite) |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v3 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Maps** | Leaflet + React-Leaflet |
| **HTTP Client** | Axios |
| **Backend** | Node.js + Express 5 |
| **Database** | MySQL (via XAMPP / mysql2) |
| **Authentication** | JWT + bcryptjs |
| **Validation** | express-validator |
| **Route Intelligence** | Python 3 (child_process scraper) |

---

## 📁 Project Structure

```
globeTrotter/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── pages/              # Route-level page components
│       │   ├── DashboardPage.jsx
│       │   ├── TripsPage.jsx
│       │   ├── CreateTripPage.jsx
│       │   ├── TripDetailsPage.jsx
│       │   ├── TripBudgetPage.jsx
│       │   ├── SharedTripPage.jsx
│       │   ├── SettingsPage.jsx
│       │   ├── AdminPage.jsx
│       │   └── NotFoundPage.jsx
│       ├── components/         # Reusable UI components
│       │   ├── AuthForm.jsx
│       │   ├── ItineraryWorkspace.jsx
│       │   ├── StopActivities.jsx
│       │   ├── RouteMap.jsx
│       │   ├── PillNavbar.jsx
│       │   ├── TopographicBackground.jsx
│       │   ├── ConfirmModal.jsx
│       │   └── Skeleton.jsx
│       ├── layouts/            # AuthLayout, MainLayout
│       ├── context/            # React Context (Auth, etc.)
│       ├── services/           # Axios API service modules
│       └── utils/              # Helper functions
│
├── server/                     # Node.js + Express backend
│   ├── controllers/            # Route handler logic
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── stopController.js
│   │   ├── activityController.js
│   │   ├── expenseController.js
│   │   ├── shareController.js
│   │   ├── scrapeController.js
│   │   └── adminController.js
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # authMiddleware.js, validate.js
│   ├── config/                 # db.js (MySQL pool connection)
│   ├── scripts/                # route_scraper.py (Python)
│   └── server.js               # Entry point
│
└── database/
    ├── schema.sql              # Full DB schema with indexes & triggers
    └── seed.sql                # Demo seed data
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/api/trips` | ✅ | Get all user's trips |
| `POST` | `/api/trips` | ✅ | Create a new trip |
| `GET` | `/api/trips/:id` | ✅ | Get single trip |
| `PUT` | `/api/trips/:id` | ✅ | Update trip |
| `DELETE` | `/api/trips/:id` | ✅ | Delete trip (cascades) |
| `GET` | `/api/trips/:tripId/stops` | ✅ | Get all stops for a trip |
| `POST` | `/api/trips/:tripId/stops` | ✅ | Add stop to trip |
| `PUT` | `/api/trips/:tripId/stops/:id` | ✅ | Update stop |
| `DELETE` | `/api/trips/:tripId/stops/:id` | ✅ | Delete stop |
| `GET` | `/api/stops/:stopId/activities` | ✅ | Get activities for stop |
| `POST` | `/api/stops/:stopId/activities` | ✅ | Add activity to stop |
| `PUT` | `/api/stops/:stopId/activities/:id` | ✅ | Update activity |
| `DELETE` | `/api/stops/:stopId/activities/:id` | ✅ | Delete activity |
| `POST` | `/api/activities/:activityId/expenses` | ✅ | Add expense to activity |
| `DELETE` | `/api/activities/:activityId/expenses/:id` | ✅ | Delete expense |
| `POST` | `/api/share/:tripId` | ✅ | Generate share link |
| `GET` | `/api/share/:shareId` | ❌ | View shared trip (public) |
| `POST` | `/api/share/:shareId/clone` | ✅ | Clone shared trip |
| `GET` | `/api/scrape/route` | ✅ | Get scraped route data |
| `POST` | `/api/scrape/save/:tripId` | ✅ | Persist route to DB |
| `GET` | `/api/scrape/saved/:tripId` | ✅ | Fetch saved route |
| `DELETE` | `/api/scrape/saved/:tripId` | ✅ | Delete saved route |
| `GET` | `/api/admin/stats` | 🔑 Admin | Platform-wide statistics |
| `GET` | `/api/admin/users` | 🔑 Admin | All users + spend data |
| `DELETE` | `/api/admin/users/:id` | 🔑 Admin | Delete user (cascades) |
| `PUT` | `/api/admin/users/:id/role` | 🔑 Admin | Update user role |

---

## 🚀 Setup & Installation

### Prerequisites

| Dependency | Version | Notes |
|---|---|---|
| Node.js | v18+ | Required for both client and server |
| npm | v9+ | Comes with Node.js |
| XAMPP / MySQL | v8.0+ | MySQL server must be running |
| Python | v3.8+ | Required only for route scraping feature |

---

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd globeTrotter
```

---

### Step 2 — Database Setup (MySQL via XAMPP)

1. **Start XAMPP** and ensure the **MySQL** service is running.
2. **Open phpMyAdmin** at [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Create a new database named `globetrotter_db`.
4. Select the `globetrotter_db` database, go to the **SQL** tab.
5. Paste and run the contents of `database/schema.sql`.

**OR via CLI:**
```bash
mysql -u root database/schema.sql
```

6. *(Optional)* Load demo seed data:
```bash
mysql -u root globetrotter_db < database/seed.sql
```

This will create the following tables:
- `users` — Registered users with roles
- `trips` — User-owned trip records
- `stops` — Destination cities within trips
- `activities` — Things to do at each stop
- `expenses` — Cost items per activity
- `shared_links` — Public sharing UUID tokens
- `trip_routes` — Persisted Python-scraped route data

---

### Step 3 — Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=globetrotter_db
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
```

> ⚠️ **XAMPP default:** MySQL runs on port `3306` with user `root` and **no password**. If you set a password in XAMPP, add it to `DB_PASSWORD`.

Start the backend server:

```bash
npm run start
```

The API will be available at: `http://localhost:5001`

---

### Step 4 — Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

### Step 5 — Python Scraper (Optional)

The route scraping feature requires Python 3. Ensure `python` (Windows) or `python3` (macOS/Linux) is available in your PATH. The scraper script is located at `server/scripts/route_scraper.py` and is invoked automatically by the backend when the route feature is used.

```bash
# Verify Python is accessible
python --version
```

---

## 🗺️ Frontend Routes

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Login screen |
| `/signup` | Public | Registration screen |
| `/share/:shareId` | Public | Read-only shared itinerary view |
| `/dashboard` | Protected | Main dashboard with stats & quick actions |
| `/trips` | Protected | Browse all personal trips |
| `/trips/new` | Protected | Create new trip form |
| `/trips/:id` | Protected | Trip detail & itinerary workspace |
| `/trips/:id/budget` | Protected | Expense tracking & budget charts |
| `/settings` | Protected | User profile & app preferences |
| `/admin` | Admin Only | Full-screen admin analytics console |

---

## 🗄️ Database Schema (ERD Summary)

```
users (1) ──< trips (1) ──< stops (1) ──< activities (1) ──< expenses
                 │
                 └──< shared_links
                 └──< trip_routes
```

All relationships use `ON DELETE CASCADE`, ensuring complete data cleanup when parent records are removed.

---

## 🎨 Design Philosophy

GlobeTrotter uses a **Cyber-Tactical** aesthetic — rejecting the generic "white-and-blue rounded corners" of typical SaaS apps in favor of:

- **High-contrast neon accents** on deep dark backgrounds
- **Glassmorphic blur overlays** for depth and layering
- **Monospace typography** for that terminal/ops feel
- **Animated topographic mesh backgrounds** for visual richness
- **Framer Motion micro-animations** on every interactive element
- **Light mode support** for accessibility, toggled per-user preference

---

## 🏆 Built For

> **Odoo Hackathon 2026** — Built with precision in an 8-hour sprint.

---

*Licensed under the MIT License.*
