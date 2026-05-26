-- Sample Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Mobile phones, laptops, tablets, and other gadgets'),
('Vehicles', 'Cars, bikes, scooters, and other vehicles'),
('Real Estate', 'Properties, apartments, lands, and commercial spaces'),
('Furniture', 'Home furniture, office furniture, and decor'),
('Fashion', 'Clothing, shoes, accessories, and apparel'),
('Books', 'Books, magazines, and educational materials'),
('Sports', 'Sports equipment, fitness gear, and outdoor items'),
('Services', 'Various services offered locally'),
('Jobs', 'Job postings and employment opportunities'),
('Education', 'Tutoring, courses, and educational programs');

-- Sample Users
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, city, state, country) VALUES
('rajesh_sharma', 'rajesh@example.com', '$2b$10$hashedpassword1', 'Rajesh', 'Sharma', '9876543210', 'Baramati', 'Maharashtra', 'India'),
('priya_patel', 'priya@example.com', '$2b$10$hashedpassword2', 'Priya', 'Patel', '9876543211', 'Baramati', 'Maharashtra', 'India'),
('amit_kulkarni', 'amit@example.com', '$2b$10$hashedpassword3', 'Amit', 'Kulkarni', '9876543212', 'Baramati', 'Maharashtra', 'India');

-- Sample Listings
INSERT INTO listings (user_id, category_id, title, description, price, condition, location, city, status) VALUES
(1, 1, 'iPhone 14 Pro - Excellent Condition', 'Barely used iPhone 14 Pro, 256GB, Space Black. Comes with original box and charger.', 65000, 'Like New', 'Market Road, Baramati', 'Baramati', 'Active'),
(2, 2, 'Honda City 2020 - Well Maintained', 'Honda City 2020 model, black color, automatic transmission, 15000 km mileage. Single owner.', 850000, 'Good', 'NH48, Baramati', 'Baramati', 'Active'),
(3, 4, 'Wooden Dining Table Set', 'Beautiful wooden dining table with 4 chairs. Good condition, slight wear marks.', 12000, 'Good', 'Residential Area, Baramati', 'Baramati', 'Active'),
(1, 3, '2 BHK Apartment - Near Market', 'Spacious 2 BHK apartment, semi-furnished, north-facing, in the heart of Baramati.', 4500000, 'Good', 'Main Market, Baramati', 'Baramati', 'Active');
