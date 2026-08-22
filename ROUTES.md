# GlobalTrotters - Routes and Navigation Flow

This document maps out the application's pages (routes) and the user's transition flow between them.

## 1. Authentication
* **Screen:** Login / Signup Screen
* **Path:** `/login` or `/signup`
* **Description:** Entry point for user authentication.
* **Transitions:**
  * **Success:** Redirects to `/dashboard` (Dashboard / Home Screen).
  * **Signup link:** Toggles to the signup view.
  * **Forgot Password:** Navigates to a password recovery flow.

## 2. Core Navigation (Authenticated)
* **Screen:** Dashboard / Home Screen
* **Path:** `/dashboard` (or `/` for logged-in users)
* **Description:** Central hub showing upcoming trips, popular cities, and quick actions.
* **Transitions:**
  * **"Plan New Trip":** Navigates to `/trips/create`.
  * **View All Trips:** Navigates to `/trips` (My Trips).
  * **Click a recent trip:** Navigates to `/trips/:id` (Itinerary View).
  * **Profile/Settings avatar:** Navigates to `/profile`.

## 3. Trip Management
* **Screen:** My Trips (Trip List) Screen
* **Path:** `/trips`
* **Description:** List view of all trips created by the user.
* **Transitions:**
  * **"Create Trip":** Navigates to `/trips/create`.
  * **Click Trip Card (View):** Navigates to `/trips/:id`.
  * **Click Trip Card (Edit):** Navigates to `/trips/:id/builder`.

* **Screen:** Create Trip Screen
* **Path:** `/trips/create`
* **Description:** Form to initialize a new trip (name, dates, cover photo).
* **Transitions:**
  * **Save/Submit:** On success, navigates to `/trips/:id/builder` to start adding details.
  * **Cancel:** Navigates back to `/dashboard` or `/trips`.

## 4. Itinerary Building
* **Screen:** Itinerary Builder Screen
* **Path:** `/trips/:id/builder`
* **Description:** Interactive interface to add cities, dates, and activities.
* **Transitions:**
  * **"Add Stop" (City):** Opens City Search Modal or navigates to `/trips/:id/search/city`.
  * **"Add Activity":** Opens Activity Search Modal or navigates to `/trips/:id/search/activity`.
  * **"Done/View Trip":** Navigates to `/trips/:id`.

* **Screen:** City Search
* **Path:** `/trips/:id/search/city` (Best implemented as a Modal/Drawer over the Builder)
* **Transitions:**
  * **"Add to Trip":** Updates the itinerary and closes modal (back to `/trips/:id/builder`).

* **Screen:** Activity Search
* **Path:** `/trips/:id/search/activity` (Best implemented as a Modal/Drawer over the Builder)
* **Transitions:**
  * **Add Activity:** Updates the itinerary and closes modal (back to `/trips/:id/builder`).

## 5. Trip Views & Analytics
* **Screen:** Itinerary View Screen
* **Path:** `/trips/:id`
* **Description:** The primary read-only/summary view of the created trip.
* **Transitions:**
  * **Edit Plan:** Navigates back to `/trips/:id/builder`.
  * **View Budget:** Navigates to `/trips/:id/budget`.
  * **View Calendar:** Navigates to `/trips/:id/calendar`.
  * **Share:** Generates a public link and can navigate to `/share/:shareId`.

* **Screen:** Trip Budget & Cost Breakdown Screen
* **Path:** `/trips/:id/budget`
* **Description:** Detailed financial breakdown of the trip.
* **Transitions:**
  * **Back:** Navigates back to `/trips/:id`.

* **Screen:** Trip Calendar / Timeline Screen
* **Path:** `/trips/:id/calendar`
* **Description:** Calendar or vertical timeline visualization.
* **Transitions:**
  * **Back:** Navigates back to `/trips/:id`.

## 6. Public Sharing
* **Screen:** Shared/Public Itinerary View Screen
* **Path:** `/share/:shareId`
* **Description:** Public, read-only view of a trip for unauthenticated or unauthorized users.
* **Transitions:**
  * **"Copy Trip":** If logged in, clones the trip and redirects to `/trips/:newId/builder`. If logged out, redirects to `/login`.

## 7. User Account
* **Screen:** User Profile / Settings Screen
* **Path:** `/profile`
* **Description:** Manage user preferences, details, and account settings.
* **Transitions:**
  * **Save:** Stays on `/profile`.
  * **Logout:** Clears session and navigates to `/login`.
  * **Back:** Navigates to `/dashboard`.

## 8. Admin (Optional)
* **Screen:** Admin / Analytics Dashboard
* **Path:** `/admin`
* **Description:** System-wide analytics and management.
* **Transitions:**
  * **Back to App:** Navigates to `/dashboard`.
