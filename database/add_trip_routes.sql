-- ============================================
-- SQL Migration: Add trip_routes table
-- ============================================

CREATE TABLE IF NOT EXISTS trip_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    mode VARCHAR(50) NOT NULL,
    stations_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Add default origin to users for auto-fetch location
ALTER TABLE users ADD COLUMN default_origin VARCHAR(255) DEFAULT NULL;
