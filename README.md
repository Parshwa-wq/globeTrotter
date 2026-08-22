# GlobeTrotter 🌍

A modern, full-stack travel planning application.

---

## 🛠️ Current Project Status (Hackathon Progress)

**What I just did (Update for the team):**
1. **Database Pivot:** We moved from PostgreSQL to **MySQL (XAMPP)**. The `database/schema.sql` and `database/seed.sql` files have been completely rewritten for MySQL. **I have already run them in my local XAMPP and verified the data.**
2. **Backend Config:** Updated `server/config/db.js` to use `mysql2` instead of `pg`. The backend successfully connects to the local MySQL db.
3. **Frontend Initialized (Phase 1):** I initialized the React app using Vite inside the `client/` folder. I also:
   - Installed our core UI dependencies: `react-router-dom`, `axios`, `framer-motion`, and `lucide-react`.
   - Setup our global CSS variables in `client/src/index.css` for the dark/neon hacker aesthetic we discussed.
   - Cleaned up the default Vite boilerplate in `App.jsx`.
4. **Architecture Docs:** I updated `ARCHITECTURE.md` to reflect the MySQL change and our new frontend tech stack so it remains our source of truth.

## 🤝 Next Steps / Handoff
- **Backend Dev:** You can start building the Express routes and controllers in `server/`. The `mysql2` pool is ready to go in `config/db.js`.
- **Frontend Dev (Me):** I will start building out the routing skeleton (`react-router-dom`), the layout wrappers, and the Authentication UI (Login/Register).

*Please pull the latest changes before you start coding to avoid merge conflicts!*
