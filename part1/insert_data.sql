-- Insert Users
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('walker1', 'walker1@example.com', 'hashed001', 'walker'),
('walker2', 'walker2@example.com', 'hashed002', 'walker');

-- Insert Dogs (using subqueries to get owner_id)
INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Rex', 'large'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Luna', 'medium'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Buddy', 'small');

-- Insert Walk Requests (using subqueries to get dog_id)
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Rex'), '2025-06-11 10:00:00', 60, 'City Park', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Luna'), '2025-06-11 14:00:00', 30, 'Dog Beach', 'completed'),
((SELECT dog_id FROM Dogs WHERE name = 'Buddy'), '2025-06-12 16:00:00', 45, 'Forest Trail', 'open');