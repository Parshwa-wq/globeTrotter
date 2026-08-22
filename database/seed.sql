-- ============================================
-- GlobeTrotter Seed Data (MySQL / XAMPP)
-- Database: globetrotter_db
--
-- Run AFTER schema.sql:
--   Open phpMyAdmin → Select globetrotter_db → SQL tab → Paste & Run
--
-- OR via CLI:
--   mysql -u root globetrotter_db < database/seed.sql
-- ============================================

USE globetrotter_db;

-- ============================================
-- USERS (3 users)
-- Passwords are bcrypt hashes of "Password@123"
-- Generated with: bcryptjs.hashSync("Password@123", 10)
-- ============================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Dhairya Patel', 'dhairya@globetrotter.dev', '$2b$10$RNinYK7O9szKHFQtu2zID.ShpPOFrYDQoFjhbGx5XVo3BElLrN6Pq', 'user'),
('Parshwa Shah', 'parshwa@globetrotter.dev', '$2b$10$RNinYK7O9szKHFQtu2zID.ShpPOFrYDQoFjhbGx5XVo3BElLrN6Pq', 'user'),
('Admin User', 'admin@globetrotter.dev', '$2b$10$RNinYK7O9szKHFQtu2zID.ShpPOFrYDQoFjhbGx5XVo3BElLrN6Pq', 'admin');

-- ============================================
-- TRIP 1: Rajasthan Heritage Tour (user: Dhairya)
-- ============================================
INSERT INTO trips (user_id, title, description, start_date, end_date, status) VALUES
(1, 'Rajasthan Heritage Tour', 'Exploring the royal palaces, forts, and vibrant culture of Rajasthan across 3 iconic cities.', '2026-09-15', '2026-09-22', 'planned');

-- Stops for Trip 1 (id = 1)
INSERT INTO stops (trip_id, stop_name, sort_order, arrival_date, departure_date) VALUES
(1, 'Jaipur', 1, '2026-09-15', '2026-09-17'),
(1, 'Jodhpur', 2, '2026-09-17', '2026-09-19'),
(1, 'Udaipur', 3, '2026-09-19', '2026-09-22');

-- Activities for Jaipur (stop_id = 1)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(1, 'Amber Fort Visit', 'Explore the magnificent Amber Fort with an elephant ride up the hill', 'sightseeing', '09:00:00', '12:00:00', 1),
(1, 'Hawa Mahal Photography', 'Visit the iconic Palace of Winds and capture stunning architecture', 'sightseeing', '14:00:00', '15:30:00', 2),
(1, 'Jaipur Street Food Tour', 'Taste authentic Rajasthani cuisine — dal baati churma, kachori, and lassi', 'food', '18:00:00', '20:00:00', 3),
(1, 'Hotel Check-in & Rest', 'Check into heritage hotel in the old city', 'accommodation', '20:30:00', '21:00:00', 4);

-- Activities for Jodhpur (stop_id = 2)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(2, 'Mehrangarh Fort Tour', 'Guided tour of one of India\'s largest and most well-preserved forts', 'sightseeing', '08:00:00', '11:00:00', 1),
(2, 'Jodhpur Blue City Walk', 'Walk through the famous blue-painted houses of the old city', 'adventure', '15:00:00', '17:00:00', 2),
(2, 'Rajasthani Thali Dinner', 'Enjoy a traditional Rajasthani thali at a local restaurant', 'food', '19:00:00', '20:30:00', 3);

-- Activities for Udaipur (stop_id = 3)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(3, 'City Palace Museum', 'Tour the stunning lakeside palace complex with panoramic city views', 'sightseeing', '10:00:00', '13:00:00', 1),
(3, 'Lake Pichola Sunset Boat Ride', 'Sunset boat ride on the beautiful Lake Pichola past Jag Mandir', 'adventure', '16:00:00', '18:00:00', 2),
(3, 'Rooftop Dinner by the Lake', 'Dinner at a lakeside rooftop restaurant with live folk music', 'food', '19:30:00', '21:30:00', 3);

-- Expenses for Jaipur activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(1, 'Fort entry ticket', 500.00, 'INR'),
(1, 'Elephant ride', 1100.00, 'INR'),
(1, 'Local guide tip', 300.00, 'INR'),
(2, 'Hawa Mahal entry ticket', 200.00, 'INR'),
(3, 'Street food tasting (per person)', 450.00, 'INR'),
(3, 'Lassi at Lassiwala', 80.00, 'INR'),
(4, 'Heritage hotel (2 nights)', 5600.00, 'INR');

-- Expenses for Jodhpur activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(5, 'Fort entry + audio guide', 600.00, 'INR'),
(5, 'Camera fee', 100.00, 'INR'),
(6, 'Walking tour guide fee', 400.00, 'INR'),
(7, 'Thali dinner (per person)', 350.00, 'INR');

-- Expenses for Udaipur activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(8, 'Palace museum entry', 300.00, 'INR'),
(8, 'Audio guide rental', 200.00, 'INR'),
(9, 'Boat ride ticket', 900.00, 'INR'),
(10, 'Rooftop dinner (per person)', 1200.00, 'INR');

-- ============================================
-- TRIP 2: Europe Backpacking (user: Dhairya)
-- ============================================
INSERT INTO trips (user_id, title, description, start_date, end_date, status) VALUES
(1, 'Europe Backpacking 2026', 'Budget-friendly backpacking adventure across Western Europe — 4 countries in 15 days.', '2026-12-01', '2026-12-15', 'draft');

-- Stops for Trip 2 (id = 2)
INSERT INTO stops (trip_id, stop_name, sort_order, arrival_date, departure_date) VALUES
(2, 'Paris', 1, '2026-12-01', '2026-12-04'),
(2, 'Amsterdam', 2, '2026-12-05', '2026-12-08'),
(2, 'Berlin', 3, '2026-12-09', '2026-12-12'),
(2, 'Prague', 4, '2026-12-12', '2026-12-15');

-- Activities for Paris (stop_id = 4)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(4, 'Eiffel Tower Summit Visit', 'Visit the iconic iron tower with summit access for panoramic views', 'sightseeing', '10:00:00', '13:00:00', 1),
(4, 'Louvre Museum Half-Day', 'Explore the world\'s largest art museum — see the Mona Lisa and Venus de Milo', 'culture', '14:00:00', '18:00:00', 2),
(4, 'Seine River Evening Cruise', 'Romantic evening cruise along the Seine with city lights', 'adventure', '19:00:00', '21:00:00', 3);

-- Activities for Amsterdam (stop_id = 5)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(5, 'Anne Frank House', 'Visit the historic house where Anne Frank wrote her famous diary', 'culture', '09:00:00', '11:00:00', 1),
(5, 'Canal Boat Tour', 'Guided boat tour through Amsterdam\'s UNESCO World Heritage canals', 'adventure', '14:00:00', '15:30:00', 2),
(5, 'Vondelpark Cycling', 'Rent a bike and cycle through Amsterdam\'s largest city park', 'adventure', '16:00:00', '18:00:00', 3);

-- Activities for Berlin (stop_id = 6)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(6, 'Brandenburg Gate & Reichstag', 'Visit the iconic gate and tour the glass dome of the Reichstag', 'sightseeing', '09:00:00', '12:00:00', 1),
(6, 'Berlin Wall Memorial', 'Walk along the preserved sections of the Berlin Wall and visit the memorial', 'culture', '14:00:00', '16:00:00', 2),
(6, 'Street Food at Markthalle Neun', 'Taste diverse street food at Berlin\'s famous market hall', 'food', '18:00:00', '20:00:00', 3);

-- Activities for Prague (stop_id = 7)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(7, 'Prague Castle Complex', 'Tour the largest ancient castle complex in the world', 'sightseeing', '09:00:00', '13:00:00', 1),
(7, 'Charles Bridge Walk', 'Walk across the historic 14th-century bridge with baroque statues', 'sightseeing', '15:00:00', '16:30:00', 2),
(7, 'Traditional Czech Dinner', 'Enjoy svickova and trdelnik at a traditional Czech restaurant', 'food', '19:00:00', '21:00:00', 3);

-- Expenses for Paris activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(11, 'Eiffel Tower summit ticket', 26.80, 'EUR'),
(12, 'Louvre museum entry', 17.00, 'EUR'),
(12, 'Audio guide rental', 5.00, 'EUR'),
(13, 'Seine cruise ticket', 15.00, 'EUR');

-- Expenses for Amsterdam activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(14, 'Anne Frank House ticket', 16.00, 'EUR'),
(15, 'Canal boat tour ticket', 18.00, 'EUR'),
(16, 'Bike rental (half day)', 12.00, 'EUR');

-- Expenses for Berlin activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(17, 'Reichstag dome (free, reservation)', 0.00, 'EUR'),
(18, 'Berlin Wall memorial (free)', 0.00, 'EUR'),
(19, 'Street food budget', 15.00, 'EUR');

-- Expenses for Prague activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(20, 'Prague Castle circuit ticket', 14.00, 'EUR'),
(21, 'Charles Bridge (free)', 0.00, 'EUR'),
(22, 'Czech dinner (per person)', 18.00, 'EUR');

-- ============================================
-- TRIP 3: Kerala Backwaters (user: Parshwa)
-- ============================================
INSERT INTO trips (user_id, title, description, start_date, end_date, status) VALUES
(2, 'Kerala Backwaters Escape', 'A relaxing trip through the serene backwaters, spice plantations, and beaches of Kerala.', '2026-10-10', '2026-10-16', 'planned');

-- Stops for Trip 3 (id = 3)
INSERT INTO stops (trip_id, stop_name, sort_order, arrival_date, departure_date) VALUES
(3, 'Kochi', 1, '2026-10-10', '2026-10-12'),
(3, 'Munnar', 2, '2026-10-12', '2026-10-14'),
(3, 'Alleppey', 3, '2026-10-14', '2026-10-16');

-- Activities for Kochi (stop_id = 8)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(8, 'Fort Kochi Heritage Walk', 'Walk through the historic Portuguese and Dutch colonial quarter', 'culture', '09:00:00', '12:00:00', 1),
(8, 'Chinese Fishing Nets at Sunset', 'Watch the iconic Chinese fishing nets being operated at sunset', 'sightseeing', '17:00:00', '18:30:00', 2),
(8, 'Kerala Seafood Dinner', 'Fresh seafood thali at a waterfront restaurant', 'food', '19:30:00', '21:00:00', 3);

-- Activities for Munnar (stop_id = 9)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(9, 'Tea Plantation Tour', 'Visit the Tata Tea Museum and walk through lush tea gardens', 'sightseeing', '09:00:00', '12:00:00', 1),
(9, 'Eravikulam National Park Trek', 'Trek through the park to spot the endangered Nilgiri Tahr', 'adventure', '14:00:00', '17:00:00', 2);

-- Activities for Alleppey (stop_id = 10)
INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES
(10, 'Houseboat Overnight Stay', 'Cruise through the serene backwaters on a traditional Kerala houseboat', 'accommodation', '12:00:00', '12:00:00', 1),
(10, 'Alleppey Beach Visit', 'Relax at the famous Alleppey beach', 'adventure', '08:00:00', '10:00:00', 2);

-- Expenses for Kochi activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(23, 'Heritage walk guide', 500.00, 'INR'),
(24, 'Fishing nets area (free)', 0.00, 'INR'),
(25, 'Seafood dinner (per person)', 800.00, 'INR');

-- Expenses for Munnar activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(26, 'Tea museum entry', 150.00, 'INR'),
(26, 'Tea tasting experience', 200.00, 'INR'),
(27, 'National park entry', 125.00, 'INR'),
(27, 'Guide fee for trek', 300.00, 'INR');

-- Expenses for Alleppey activities
INSERT INTO expenses (activity_id, description, amount, currency) VALUES
(28, 'Houseboat overnight (2 pax)', 8500.00, 'INR'),
(28, 'Meals on houseboat', 1500.00, 'INR'),
(29, 'Beach parking & snacks', 200.00, 'INR');

-- ============================================
-- SHARED LINKS (using UUID() function)
-- ============================================
INSERT INTO shared_links (trip_id, share_id) VALUES (1, UUID());
INSERT INTO shared_links (trip_id, share_id) VALUES (3, UUID());

-- ============================================
-- VERIFICATION QUERIES (run these to confirm data)
-- ============================================
-- SELECT COUNT(*) AS user_count FROM users;           -- Expected: 3
-- SELECT COUNT(*) AS trip_count FROM trips;            -- Expected: 3
-- SELECT COUNT(*) AS stop_count FROM stops;            -- Expected: 10
-- SELECT COUNT(*) AS activity_count FROM activities;   -- Expected: 29
-- SELECT COUNT(*) AS expense_count FROM expenses;      -- Expected: 36
-- SELECT COUNT(*) AS share_count FROM shared_links;    -- Expected: 2
