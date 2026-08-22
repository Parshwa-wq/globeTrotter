-- ============================================
-- GlobeTrotter Database Schema (MySQL / XAMPP)
-- Database: globetrotter_db
--
-- How to run:
--   1. Open phpMyAdmin (http://localhost/phpmyadmin)
--   2. Create database "globetrotter_db"
--   3. Select it, go to SQL tab, paste & run this file
--
-- OR via CLI:
--   mysql -u root < database/schema.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS globetrotter_db;
USE globetrotter_db;

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS shared_links;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS trip_routes;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- Stores all registered users (regular + admin)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_photo TEXT DEFAULT NULL,
    language_pref VARCHAR(10) DEFAULT 'en',
    default_origin VARCHAR(255) DEFAULT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TRIPS TABLE
-- Each user can create many trips
-- ============================================
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image_url TEXT,
    status ENUM('draft', 'planned', 'ongoing', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_trip_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2.5. TRIP_ROUTES TABLE
-- AI Generated transit routes for trips
-- ============================================
CREATE TABLE trip_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    mode VARCHAR(50) NOT NULL,
    stations_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_routes_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. STOPS TABLE
-- Cities/destinations within a trip
-- ============================================
CREATE TABLE stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    stop_name VARCHAR(200) NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    sort_order INT DEFAULT 0,
    CONSTRAINT fk_stops_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT chk_stop_dates CHECK (departure_date >= arrival_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ACTIVITIES TABLE
-- Things to do at each stop
-- ============================================
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stop_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('sightseeing', 'food', 'adventure', 'shopping', 'transport', 'accommodation', 'nightlife', 'culture', 'other') NOT NULL,
    start_time TIME,
    end_time TIME,
    sort_order INT DEFAULT 0,
    CONSTRAINT fk_activities_stop FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. EXPENSES TABLE
-- Cost items attached to activities
-- ============================================
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    description VARCHAR(200) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency ENUM('INR', 'USD', 'EUR', 'GBP') DEFAULT 'INR',
    CONSTRAINT fk_expenses_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT chk_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. SHARED_LINKS TABLE
-- Public sharing of trips via unique UUIDs
-- ============================================
CREATE TABLE shared_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    share_id CHAR(36) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shared_links_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_stops_trip_id ON stops(trip_id);
CREATE INDEX idx_stops_sort_order ON stops(trip_id, sort_order);
CREATE INDEX idx_activities_stop_id ON activities(stop_id);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_expenses_activity_id ON expenses(activity_id);
CREATE INDEX idx_shared_links_share_id ON shared_links(share_id);
CREATE INDEX idx_shared_links_trip_id ON shared_links(trip_id);

-- ============================================
-- TRIGGER: Auto-generate UUID for shared_links
-- (MySQL doesn't have DEFAULT gen_random_uuid())
-- ============================================
DELIMITER //
CREATE TRIGGER trg_shared_links_uuid
    BEFORE INSERT ON shared_links
    FOR EACH ROW
BEGIN
    IF NEW.share_id IS NULL OR NEW.share_id = '' THEN
        SET NEW.share_id = UUID();
    END IF;
END //
DELIMITER ;

-- ============================================
-- VERIFICATION: Show all tables
-- ============================================
-- SHOW TABLES;
-- Expected: users, trips, stops, activities, expenses, shared_links
