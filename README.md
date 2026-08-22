# GlobeTrotter 🌍

A modern, high-performance travel itinerary and budget management platform built for the Odoo Hackathon. GlobeTrotter leverages a sleek, terminal-inspired glassmorphic aesthetic to deliver a premium user experience.

## ✨ Core Features

*   **Itinerary Command Center:** Visually plan stops and activities on a chronological timeline with dynamic micro-animations.
*   **Multi-Currency Budgeting:** Track expenses per activity with real-time FX conversions powered by `exchange-rate-api`.
*   **Public Trip Sharing:** Generate secure, unique UUID links to share itineraries publicly, with instant 1-click cloning for authenticated users.
*   **Bento-Box UI Architecture:** Built with Framer Motion, utilizing a strictly typed design system featuring glowing neons, deep dark modes, and topographic mesh backgrounds.
*   **Cascading Lifecycle Management:** Robust PostgreSQL triggers ensure complete data sanitization when users delete trips, stops, or accounts.
*   **Zero-Jank Rendering:** Memoized React components and optimized `useMemo` computation hooks guarantee 60fps scrolling and interaction.

## 🛠 Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, React Router.
*   **Backend:** Node.js, Express, PostgreSQL, JWT Authentication.
*   **Integrations:** ExchangeRate-API (Currency Conversions).

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd globeTrotter
   ```

2. **Database Initialization:**
   Run the schema setup script inside your PostgreSQL instance:
   ```bash
   psql -U postgres -d globetrotter -f database/schema.sql
   ```

3. **Backend Configuration:**
   Navigate to the `server` directory and create a `.env` file:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=globetrotter
   JWT_SECRET=super_secret_jwt_key
   EXCHANGE_RATE_API_KEY=your_api_key
   ```
   Install dependencies and run:
   ```bash
   cd server
   npm install
   npm run start
   ```

4. **Frontend Configuration:**
   Navigate to the `client` directory and create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Install dependencies and run:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🎨 Design Philosophy
GlobeTrotter abandons the generic "white-and-blue rounded corners" typical of SaaS applications in favor of a "Cyber-Tactical" aesthetic. It leans heavily into high-contrast neon accents, glassmorphic blur overlays, and monospace typography to make travel planning feel less like filing a spreadsheet and more like executing a covert operation.

---
*Built with precision for the Odoo Hackathon 2026.*
