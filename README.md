# GlobeTrotter 🌍

A modern, full-stack travel planning application.

---

## 🛠️ Current Project Status (Hackathon Progress)

**What was just done:**
1. **Database & Backend Base (Phase 1):** Switched to **MySQL (XAMPP)**, tested local DB connections, and backend is setup with `mysql2` and `server.js` (pulled cleanly, no conflicts).
2. **Frontend Routing Skeleton (Phase 2):** 
   - Wrapped the app in `react-router-dom` (`main.jsx`).
   - Created `AuthLayout.jsx` (for login/signup) and `MainLayout.jsx` (for the dashboard).
   - Created empty placeholder pages (`LoginPage.jsx`, `SignupPage.jsx`, `DashboardPage.jsx`, `NotFoundPage.jsx`).
   - Mapped all these routes in `App.jsx`.

*Note: The frontend code compiles perfectly with zero errors.*

## 🤝 Next Steps / Handoff
- **Backend Dev:** You have full ownership of `server/`. You can continue building the authentication and trip controllers. Our API URL structure will be `http://localhost:5000/api/...`.
- **Frontend Dev (Me):** Next up is **Phase 3 & 4**, where I will implement the custom `AuthContext` and build out the actual animated `AuthForm.jsx` UI component for the login/signup pages.

*Please pull the latest changes before you start coding to avoid merge conflicts!*
