# GlobeTrotter 🌍

A modern, full-stack travel planning application.

---

## 🛠️ Current Project Status (Hackathon Progress)

**What was just done:**
1. **Database & Backend Base (Phase 1):** Switched to **MySQL (XAMPP)**, tested local DB connections, and backend is setup with `mysql2` and `server.js`.
2. **Frontend Routing Skeleton (Phase 2):** Setup React Router, `AuthLayout`, `MainLayout`, and placeholder pages.
3. **Authentication Context & API Layer (Phase 3):** Built `api.js` (Axios interceptors) and `AuthContext.jsx` to handle global JWT state securely.
4. **Authentication UI (Phase 4):** 
   - Configured **Tailwind CSS v3** in Vite for rapid UI styling.
   - Built the beautiful, animated `AuthForm.jsx` (terminal aesthetic).
   - Removed OAuth dependencies as requested (pure email/password).
   - Wired the form directly into our `AuthContext`.
5. **Dashboard & Main Layout (Phase 5):**
   - Extracted UI components: `PillNavbar`, `Skeleton`, and `TopographicBackground`.
   - Built the protected `MainLayout` with ambient glow and topographic effects.
   - Created a comprehensive `DashboardPage` featuring top-level metrics, upcoming trip widgets, and dynamic API data fetching (hitting `/api/trips`).

## 🤝 Next Steps / Handoff
- **Backend Dev:** You have full ownership of `server/`. Continue building the trip, stop, and activity controllers.
- **Frontend Dev (Me):** I will begin building out the core application pages inside `MainLayout.jsx`, specifically the Trip Details page and the New Trip creation flow.

*Please pull the latest changes before you start coding to avoid merge conflicts!*
