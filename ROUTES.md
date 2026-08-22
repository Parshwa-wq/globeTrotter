# GlobalTrotters - Navigation Plan & Route Architecture

This document provides a highly structured view of the application's routing plan, designed specifically to help map out the frontend architecture (e.g., using React Router). It includes layout groupings, path definitions, and detailed transition flows.

## 1. Route Hierarchy

### Public Routes (No Authentication Required)
*(These routes do not require a logged-in user and typically have a minimal layout)*
* **`/login`** - Login Screen
* **`/signup`** - Signup Screen
* **`/share/:shareId`** - Shared/Public Itinerary View Screen
* **`*` (Catch-all)** - 404 Not Found Screen

### Protected Core Routes (Authentication Required)
*(Wrapped in a `MainLayout` containing a global Navbar or Sidebar)*
* **`/` or `/dashboard`** - Dashboard / Home Screen
* **`/trips`** - My Trips (Trip List) Screen
* **`/trips/create`** - Create Trip Screen (Form to initialize a trip)
* **`/profile`** - User Profile / Settings Screen

### Trip Details & Views (Authentication Required)
*(Nested under a `TripLayout` that provides contextual trip tabs/navigation)*
* **`/trips/:id`** - Itinerary View Screen (Overview/Summary of the trip)
* **`/trips/:id/budget`** - Trip Budget & Cost Breakdown Screen
* **`/trips/:id/calendar`** - Trip Calendar / Timeline Screen

### Trip Builder Workspace (Authentication Required)
*(Typically a full-screen layout focused heavily on interaction)*
* **`/trips/:id/builder`** - Itinerary Builder Screen (Main drag/drop workspace)
  * **Modal / Nested Route:** `City Search` (e.g., `/trips/:id/builder?modal=citySearch`)
  * **Modal / Nested Route:** `Activity Search` (e.g., `/trips/:id/builder?modal=activitySearch`)

### Admin Routes (Admin Role Required)
*(Wrapped in a dedicated `AdminLayout`)*
* **`/admin`** - Admin / Analytics Dashboard

---

## 2. Key Transition Flows

### A. The "Create & Build" Flow
1. User clicks **"Plan New Trip"** on `/dashboard`.
2. Transitions to **`/trips/create`**.
3. User enters basic info (Name, Dates, Cover Image) and clicks Save.
4. System creates trip (generating an `:id`) and transitions to **`/trips/:id/builder`**.
5. Inside the builder, the user opens the **City Search** and **Activity Search** modals to populate the itinerary.
6. Once satisfied, user clicks **"View Trip"**, transitioning to **`/trips/:id`**.

### B. The "Review & Manage" Flow
1. User navigates to **`/trips`** to see all their saved trips.
2. User clicks a trip card, transitioning to **`/trips/:id`**.
3. From the Trip Overview, the user can toggle between different perspectives:
   * Click **"Budget"** -> transitions to **`/trips/:id/budget`**.
   * Click **"Calendar"** -> transitions to **`/trips/:id/calendar`**.
   * Click **"Edit Plan"** -> transitions to **`/trips/:id/builder`**.

### C. The "Share & Duplicate" Flow
1. User clicks **"Share"** on **`/trips/:id`**, which generates a public link (e.g., `/share/abc-123`).
2. A visitor (unauthenticated) visits **`/share/abc-123`** and views the read-only itinerary.
3. The visitor clicks **"Copy Trip"**:
   * *If not logged in:* Redirects to **`/login?redirect=/share/abc-123`**.
   * *If logged in:* Clones the trip to their account and transitions them to **`/trips/:newId/builder`** so they can tweak it themselves.

### D. Authentication Flow
1. User arrives at **`/login`**.
2. Upon successful authentication, transitions to **`/dashboard`**.
3. If they need to reset a password, they navigate to a "Forgot Password" modal/route.
4. From anywhere in the app, user goes to **`/profile`** -> clicks **"Logout"** -> clears session and redirects to **`/login`**.
