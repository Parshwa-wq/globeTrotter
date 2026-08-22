-- ============================================
-- GlobeTrotter Database Schema (PostgreSQL)
-- ============================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS shared_links CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_photo TEXT DEFAULT NULL,
    language_pref VARCHAR(10) DEFAULT 'en',
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TRIPS TABLE
-- ============================================
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'ongoing', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_trip_dates CHECK (end_date >= start_date)
);

-- ============================================
-- 3. STOPS TABLE
-- ============================================
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    day_number INT NOT NULL,
    sort_order INT DEFAULT 0,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    CONSTRAINT chk_stop_dates CHECK (departure_date >= arrival_date),
    CONSTRAINT chk_day_number CHECK (day_number > 0)
);

-- ============================================
-- 4. ACTIVITIES TABLE
-- ============================================
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    stop_id INT NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('sightseeing', 'food', 'adventure', 'shopping', 'transport', 'accommodation', 'nightlife', 'culture', 'other')),
    start_time TIME,
    end_time TIME,
    sort_order INT DEFAULT 0
);

-- ============================================
-- 5. EXPENSES TABLE
-- ============================================
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    activity_id INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    description VARCHAR(200) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'INR' CHECK (currency IN ('INR', 'USD', 'EUR', 'GBP'))
);

-- ============================================
-- 6. SHARED_LINKS TABLE
-- ============================================
CREATE TABLE shared_links (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    share_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
