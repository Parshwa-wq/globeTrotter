# 🚀 Odoo Hackathon 2026 - Master Context & Strategy File

## 🎯 Core Philosophy & Approach (Main Evaluation Criteria)
*   **Logical Problem Solving:** The solution must demonstrate a thoughtful, real-world approach to the problem statement. 
*   **Completeness over Complexity:** Build a robust, working minimum viable product (MVP) from scratch with minimal reliance on third-party APIs.
*   **Attention to Detail:** Judges look for edge-case handling, polished error states, and a flawless "happy path."
*   **Gimmick Restriction:** Do NOT force AI, Blockchain, or Chatbots into the project unless they specifically solve a core requirement of the problem statement.

## 🗄️ Database & Backend Design (Highly Important)
*   **Local Relational Database:** STRICTLY use a local PostgreSQL database (via XAMPP/pgAdmin). Do NOT use BaaS like Supabase, Firebase, or MongoDB.
*   **Data Modeling:** The ERD (Entity-Relationship Diagram) must be logical, normalized, and scalable. Proper use of foreign keys, indexes, and constraints is required.
*   **Backend APIs:** Design clean, RESTful APIs. Endpoints must be modular, secure, and handle heavy data operations efficiently.
*   **Dynamic Data:** The application must consume and process real-time, dynamic data. Hardcoding data is strictly prohibited.
*   **Robust Input Validation:** Every API endpoint and frontend form must have strict validation (type checking, length limits, sanitization) to prevent SQL injection and bad data.

## 🎨 Frontend UI/UX & Design Architecture
*   **Premium & Unique Aesthetics:** The UI must be professional, uniform, and stand out from generic templates.
*   **Micro-Interactions:** Implement smooth, performant hover states and mouse-interactive animations to make the UI feel alive and responsive.
*   **Clean & Responsive:** The design must be 100% responsive across devices with a clean, uncluttered layout.
*   **Intuitive Navigation:** The user journey must be frictionless. Use clear routing, breadcrumbs, and accessible menus.
*   **State Management:** Ensure UI state updates optimistically and handles loading/error states gracefully.

## 💻 Codebase & Engineering Standards
*   **Clean Code & Patterns:** Follow strict coding standards (e.g., DRY, SOLID principles). Code must be highly readable and self-documenting.
*   **Modularity:** Break down the frontend into reusable components and the backend into isolated services/controllers.
*   **Scalability & Performance:** Write optimized algorithms. Avoid N+1 query problems in the database and unnecessary re-renders in the frontend.
*   **Security:** Implement proper authentication, route protection, and data sanitization.
*   **Debugging Skills:** Leave no console errors or warnings. Ensure proper error logging and graceful failure handling.

## 🛠️ Workflow & Git Requirements
*   **Version Control:** Commit frequently using clear, descriptive commit messages (e.g., `feat: setup PostgreSQL schema for users`).
*   **Branching:** Use proper Git branches if collaborating. Do not dump everything into a single massive commit at the end of the hackathon.

---

### 📝 Official Hackathon Timeline & Strategy (Aug 22)
1.  [ ] **08:30 AM (Select Problem Statement):** You have 30 minutes. Do NOT code. Design the Database Schema (ERD), plan API endpoints, and sketch the UI flow.
2.  [ ] **09:00 AM (Coding Starts & Submit Repo):** Create the empty GitHub repo immediately and submit the link. Scaffold backend/frontend boilerplate and setup local PostgreSQL.
3.  [ ] **10:00 AM (Add Evaluator as Collaborator):** Make sure you have a clean initial commit pushed before adding them. *Note: They can see your progress live from this point forward! Commit frequently!*
4.  [ ] **10:30 AM - 12:30 PM:** Build Core APIs (CRUD with strict validation) and Scaffold Frontend UI (Animated, responsive, modular).
5.  [ ] **12:30 PM - 03:00 PM:** Integration (Connect UI to local APIs, ensure dynamic real-time data flows).
6.  [ ] **03:00 PM - 04:30 PM:** Security, Validation, Bug Squashing, and UI Polish.
7.  [ ] **04:30 PM - 05:00 PM:** Write a killer README, clean up the codebase, and push final commits.
8.  [ ] **05:00 PM (Coding Time Ends):** STOP CODING. Start recording your demo video using a pre-written script.
9.  [ ] **05:30 PM (Submit Video Link):** Final deadline to submit the video presentation link.
