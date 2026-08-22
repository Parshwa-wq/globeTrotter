# 🎨 Frontend Developer Guide — GlobeTrotter

> **Owner:** Dhairya (Frontend + Database Dev)
> This is your complete playbook for building the React frontend during the hackathon.

---

## 📌 Tech Stack

| Tool | Purpose |
|------|---------|
| **React 18** (via Vite) | UI Library |
| **React Router v6** | Client-side routing with nested layouts |
| **Axios** | HTTP client for API calls |
| **Vanilla CSS / CSS Modules / tailwind css** | Styling (leveraging `odoo-ui-kit` design system) |
| **React Context** | Global auth state management |

---

## 🗂️ File Structure

```
client/src/
├── assets/                  # Static images, icons, fonts
├── components/              # Reusable UI components
│   ├── Navbar.jsx
│   ├── TripCard.jsx
│   ├── BudgetChart.jsx
│   ├── CalendarView.jsx
│   ├── CitySearchModal.jsx
│   ├── ActivitySearchModal.jsx
│   ├── ProtectedRoute.jsx
│   └── LoadingSpinner.jsx
├── layouts/                 # Layout wrappers (render <Outlet />)
│   ├── AuthLayout.jsx       # Minimal layout for /login, /signup
│   ├── MainLayout.jsx       # Navbar + Sidebar for dashboard pages
│   ├── TripLayout.jsx       # Trip-specific tabs (Overview/Budget/Calendar)
│   └── AdminLayout.jsx      # Admin dashboard wrapper
├── pages/                   # One file per route
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   ├── TripsListPage.jsx
│   ├── CreateTripPage.jsx
│   ├── TripOverviewPage.jsx
│   ├── TripBudgetPage.jsx
│   ├── TripCalendarPage.jsx
│   ├── TripBuilderPage.jsx
│   ├── SharedTripPage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminPage.jsx
│   └── NotFoundPage.jsx
├── services/                # API call functions (Axios)
│   ├── api.js               # Axios instance + interceptors
│   ├── authService.js
│   ├── tripService.js
│   ├── stopService.js
│   ├── activityService.js
│   └── shareService.js
├── context/
│   └── AuthContext.jsx       # JWT token + user state
├── hooks/
│   └── useAuth.js            # Custom hook to consume AuthContext
├── utils/                   # Helper functions (date formatting, etc.)
├── App.jsx                  # Router setup
├── main.jsx                 # Entry point
└── index.css                # Global styles + design tokens
```

---

## 🛣️ Routing Blueprint (App.jsx)

```jsx
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Route>
    <Route path="/share/:shareId" element={<SharedTripPage />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trips" element={<TripsListPage />} />
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<TripLayout />}>
        <Route path="/trips/:id" element={<TripOverviewPage />} />
        <Route path="/trips/:id/budget" element={<TripBudgetPage />} />
        <Route path="/trips/:id/calendar" element={<TripCalendarPage />} />
      </Route>

      <Route path="/trips/:id/builder" element={<TripBuilderPage />} />

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

---

## 📋 Page-by-Page Build Checklist

### 🔴 P0 — Critical (Build First: 09:00 - 10:30)

- [ ] **Scaffold Vite React App** — `npm create vite@latest ./ -- --template react`
- [ ] **Install dependencies** — `npm install react-router-dom axios`
- [ ] **Setup `index.css`** — Import design tokens from `odoo-ui-kit`
- [ ] **Build `AuthContext.jsx`** — Store JWT in localStorage, expose `login()`, `logout()`, `user`
- [ ] **Build `ProtectedRoute.jsx`** — Redirect to `/login` if no token
- [ ] **Build `api.js`** — Axios instance with `baseURL` and JWT interceptor
- [ ] **Build `LoginPage.jsx`** — Email + Password fields, validation, call `POST /api/auth/login`
- [ ] **Build `SignupPage.jsx`** — Name + Email + Password, call `POST /api/auth/signup`

### 🔴 P0 — Core Pages (Build: 10:30 - 12:30)

- [ ] **Build `Navbar.jsx`** — Logo, nav links (Dashboard, My Trips, Profile), logout button
- [ ] **Build `MainLayout.jsx`** — Renders `<Navbar />` + `<Outlet />`
- [ ] **Build `AuthLayout.jsx`** — Minimal centered layout + `<Outlet />`
- [ ] **Build `DashboardPage.jsx`** — Welcome message, recent trips list, "Plan New Trip" CTA, recommended destinations
- [ ] **Build `TripsListPage.jsx`** — Grid of `TripCard` components, empty state, "Create Trip" button
- [ ] **Build `TripCard.jsx`** — Card showing trip name, date range, destination count, edit/view/delete actions
- [ ] **Build `CreateTripPage.jsx`** — Form: title, start/end dates, description, cover photo upload, save button

### 🟡 P1 — Trip Detail Pages (Build: 12:30 - 03:00)

- [ ] **Build `TripLayout.jsx`** — Tab navigation (Overview | Budget | Calendar) + `<Outlet />`
- [ ] **Build `TripOverviewPage.jsx`** — Day-wise layout, city headers, activity blocks, "Edit" and "Share" buttons
- [ ] **Build `TripBudgetPage.jsx`** — Cost breakdown by category (transport, stay, activities, meals), pie/bar charts, overbudget alerts
- [ ] **Build `BudgetChart.jsx`** — Reusable chart component (CSS-based or lightweight library)
- [ ] **Build `TripCalendarPage.jsx`** — Calendar grid or vertical timeline, expandable day views
- [ ] **Build `CalendarView.jsx`** — Reusable calendar component
- [ ] **Build `TripBuilderPage.jsx`** — Full-screen workspace: "Add Stop" button, city list, activity list per stop, reorder
- [ ] **Build `CitySearchModal.jsx`** — Search bar, city results with country/cost index, "Add to Trip" button, filter by region
- [ ] **Build `ActivitySearchModal.jsx`** — Activity filters (type, cost, duration), add/remove buttons, quick view

### 🟡 P1 — Sharing & Profile (Build: 03:00 - 04:00)

- [ ] **Build `SharedTripPage.jsx`** — Public read-only view, "Copy Trip" button, social sharing links
- [ ] **Build `ProfilePage.jsx`** — Editable name/email/photo, language preference, delete account, saved destinations

### 🟢 P2 — Polish & Optional (Build: 04:00 - 04:30)

- [ ] **Build `AdminPage.jsx`** — Tables/charts: trips created, top cities, user engagement, user management
- [ ] **Build `AdminLayout.jsx`** — Admin-specific sidebar + `<Outlet />`
- [ ] **Build `NotFoundPage.jsx`** — 404 page with "Go Home" link
- [ ] **Build `LoadingSpinner.jsx`** — Reusable skeleton/spinner component
- [ ] **Add micro-animations** — Hover effects, page transitions, button feedback
- [ ] **Responsive polish** — Test on mobile viewports, fix overflow issues
- [ ] **Error states** — Handle API errors gracefully on every page
- [ ] **Empty states** — Show friendly messages when lists are empty

---

## 🔌 API Service Layer Reference

### `api.js` — Axios Instance
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### `authService.js`
```javascript
import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (name, email, password) => api.post('/auth/signup', { name, email, password });
export const getMe = () => api.get('/auth/me');
```

### `tripService.js`
```javascript
import api from './api';

export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data);
export const updateTrip = (id, data) => api.put(`/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);
export const getTripBudget = (id) => api.get(`/trips/${id}/budget`);
```

### `stopService.js`
```javascript
import api from './api';

export const getStops = (tripId) => api.get(`/trips/${tripId}/stops`);
export const createStop = (tripId, data) => api.post(`/trips/${tripId}/stops`, data);
export const updateStop = (tripId, id, data) => api.put(`/trips/${tripId}/stops/${id}`, data);
export const deleteStop = (tripId, id) => api.delete(`/trips/${tripId}/stops/${id}`);
```

### `activityService.js`
```javascript
import api from './api';

export const getActivities = (stopId) => api.get(`/stops/${stopId}/activities`);
export const createActivity = (stopId, data) => api.post(`/stops/${stopId}/activities`, data);
export const updateActivity = (stopId, id, data) => api.put(`/stops/${stopId}/activities/${id}`, data);
export const deleteActivity = (stopId, id) => api.delete(`/stops/${stopId}/activities/${id}`);
```

### `shareService.js`
```javascript
import api from './api';

export const shareTrip = (tripId) => api.post(`/share/${tripId}`);
export const getSharedTrip = (shareId) => api.get(`/share/${shareId}`);
export const cloneTrip = (shareId) => api.post(`/share/${shareId}/clone`);
```

---

## 🎨 Design System Notes (from odoo-ui-kit)

Leverage these existing components from the `odoo-ui-kit`:
- **AnimatedButton** — For all CTA buttons (Plan New Trip, Save, Share)
- **BentoGrid** — For the Dashboard layout (recent trips, recommendations)
- **Modal** — For CitySearchModal and ActivitySearchModal
- **Input** — For all form fields (login, signup, create trip)
- **Badge** — For trip status (draft, planned, completed)
- **Table** — For admin analytics tables
- **Skeleton** — For loading states on every page
- **PillNavbar** — For TripLayout tab navigation (Overview | Budget | Calendar)
- **TopographicBackground** — For auth pages (login/signup)
- **ProgressCircular** — For budget progress indicators
- **SegmentedProgress** — For trip completion progress
- **MediaCard** — For trip cards and destination cards
- **Toast** — For success/error notifications

---

## ⚠️ Key Rules to Follow

1. **No hardcoded data** — Every list, card, and chart must be fed from API responses.
2. **Zero console errors** — Clean up all warnings before final commit.
3. **Commit frequently** — e.g., `feat: build login page with validation`
4. **Validate all forms** — Check required fields, email format, date ranges before API calls.
5. **Handle loading/error/empty states** — Every page that fetches data needs all three.
