-- Cycle Marketplace Database Setup
-- Complete database setup for Supabase
-- Run this script in your Supabase SQL Editor

-- Create cycles table
CREATE TABLE IF NOT EXISTS cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  specifications JSONB,
  features TEXT[],
  image_url TEXT,
  images TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create holds table
CREATE TABLE IF NOT EXISTS cycle_holds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  hold_start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hold_end_time TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '20 minutes'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS cycle_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to automatically expire holds
CREATE OR REPLACE FUNCTION expire_holds()
RETURNS void AS $$
BEGIN
  UPDATE cycle_holds 
  SET is_active = false 
  WHERE hold_end_time < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cycles_type ON cycles(type);
CREATE INDEX IF NOT EXISTS idx_cycles_brand ON cycles(brand);
CREATE INDEX IF NOT EXISTS idx_cycles_available ON cycles(is_available);
CREATE INDEX IF NOT EXISTS idx_holds_active ON cycle_holds(is_active);
CREATE INDEX IF NOT EXISTS idx_holds_end_time ON cycle_holds(hold_end_time);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Enable Row Level Security (RLS)
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to cycles" ON cycles;
DROP POLICY IF EXISTS "Allow public read access to reviews" ON cycle_reviews;
DROP POLICY IF EXISTS "Allow public read access to holds" ON cycle_holds;
DROP POLICY IF EXISTS "Allow public create holds" ON cycle_holds;
DROP POLICY IF EXISTS "Allow admin full access to cycles" ON cycles;
DROP POLICY IF EXISTS "Allow admin update holds" ON cycle_holds;
DROP POLICY IF EXISTS "Allow admin delete holds" ON cycle_holds;
DROP POLICY IF EXISTS "Allow admin full access to reviews" ON cycle_reviews;
DROP POLICY IF EXISTS "public_select_holds" ON cycle_holds;
DROP POLICY IF EXISTS "public_insert_holds" ON cycle_holds;
DROP POLICY IF EXISTS "auth_all_holds" ON cycle_holds;

-- Create policies for cycles table
CREATE POLICY "Allow public read access to cycles" ON cycles FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to cycles" ON cycles FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create policies for cycle_holds table (fixed RLS)
CREATE POLICY "public_select_holds" ON cycle_holds FOR SELECT TO public USING (true);
CREATE POLICY "public_insert_holds" ON cycle_holds FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "auth_all_holds" ON cycle_holds FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create policies for reviews table
CREATE POLICY "Allow public read access to reviews" ON cycle_reviews FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to reviews" ON cycle_reviews FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create policies for contacts table
CREATE POLICY "Allow public create contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Insert sample data for cycles
INSERT INTO cycles (name, brand, model, type, price, description, specifications, features, image_url, stock_quantity) VALUES
('Mountain Explorer Pro', 'Trek', 'X-Trail 2024', 'Mountain', 899.99, 'Professional mountain bike designed for rugged terrains and adventure seekers.', 
 '{"frame": "Aluminum", "gears": "21-speed", "wheel_size": "26 inch", "weight": "15kg", "brake_type": "Disc"}',
 ARRAY['Lightweight aluminum frame', 'All-terrain tires', 'Shock absorption', 'Quick release wheels'],
 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500', 10),

('City Cruiser Deluxe', 'Giant', 'Urban-C 2024', 'City', 549.99, 'Comfortable city bike perfect for daily commuting and leisure rides.',
 '{"frame": "Steel", "gears": "7-speed", "wheel_size": "28 inch", "weight": "18kg", "brake_type": "V-brake"}',
 ARRAY['Comfortable seat', 'Built-in lights', 'Cargo basket', 'Chain guard'],
 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', 15),

('Speed Demon Racing', 'Specialized', 'Velocity-R 2024', 'Road', 1299.99, 'High-performance road bike built for speed and competitive racing.',
 '{"frame": "Carbon fiber", "gears": "16-speed", "wheel_size": "700c", "weight": "8kg", "brake_type": "Caliper"}',
 ARRAY['Carbon fiber frame', 'Aerodynamic design', 'Racing handlebars', 'Lightweight wheels'],
 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500', 8),

('Electric Commuter', 'Rad Power', 'E-City 2024', 'Electric', 1899.99, 'Electric bike with long battery life, perfect for effortless commuting.',
 '{"frame": "Aluminum", "gears": "8-speed", "wheel_size": "26 inch", "weight": "25kg", "brake_type": "Hydraulic disc", "battery": "48V 14Ah", "range": "50 miles"}',
 ARRAY['Electric motor', 'Long-range battery', 'LCD display', 'USB charging port'],
 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', 5),

('BMX Stunt Master', 'Mongoose', 'Freestyle 2024', 'BMX', 299.99, 'Durable BMX bike perfect for tricks and stunts.',
 '{"frame": "Steel", "gears": "Single speed", "wheel_size": "20 inch", "weight": "12kg", "brake_type": "U-brake"}',
 ARRAY['Reinforced frame', 'Stunt pegs', 'Grip tape', 'Durable tires'],
 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500', 12),

('Hybrid Comfort', 'Cannondale', 'Quick-CX 2024', 'Hybrid', 749.99, 'Versatile hybrid bike combining comfort and performance.',
 '{"frame": "Aluminum", "gears": "24-speed", "wheel_size": "700c", "weight": "13kg", "brake_type": "Disc"}',
 ARRAY['Ergonomic design', 'Suspension fork', 'Multiple hand positions', 'Puncture-resistant tires'],
 'https://images.unsplash.com/photo-1544191696-15693072b5a8?w=500', 7);

-- Insert sample contact data for testing
INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0123', 'Question about Mountain Bikes', 'Hi, I am interested in the Mountain Explorer Pro. Can you tell me more about the warranty and maintenance requirements?', 'unread'),
('Sarah Johnson', 'sarah.j@email.com', '+1-555-0124', 'Shipping Information', 'How long does shipping typically take for orders within the city? I need the bike by next weekend.', 'unread'),
('Mike Chen', 'mike.chen@email.com', '+1-555-0125', 'Electric Bike Battery Life', 'What is the expected battery life of the Electric Commuter bike? How often does it need replacement?', 'read'),
('Emma Wilson', 'emma.w@email.com', '+1-555-0126', 'Bulk Purchase Inquiry', 'We are a cycling club looking to purchase 10 bikes for our members. Do you offer group discounts?', 'unread'),
('David Brown', 'david.brown@email.com', '+1-555-0127', 'Return Policy Question', 'What is your return policy if the bike does not fit properly? Can I exchange for a different size?', 'read');

-- Create helpful views for admin dashboard
CREATE OR REPLACE VIEW cycle_inventory_summary AS
SELECT 
    type,
    COUNT(*) as total_cycles,
    SUM(stock_quantity) as total_stock,
    AVG(price) as average_price,
    COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as available_cycles
FROM cycles 
GROUP BY type;

CREATE OR REPLACE VIEW active_holds_summary AS
SELECT 
    c.name as cycle_name,
    c.brand,
    c.type,
    ch.customer_name,
    ch.customer_email,
    ch.hold_start_time,
    ch.hold_end_time,
    EXTRACT(EPOCH FROM (ch.hold_end_time - NOW()))/60 as minutes_remaining
FROM cycle_holds ch
JOIN cycles c ON ch.cycle_id = c.id
WHERE ch.is_active = true AND ch.hold_end_time > NOW()
ORDER BY ch.hold_end_time ASC;

-- Function to get contact statistics
CREATE OR REPLACE FUNCTION get_contact_stats()
RETURNS TABLE(
    total_contacts BIGINT,
    unread_contacts BIGINT,
    read_contacts BIGINT,
    today_contacts BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_contacts,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_contacts,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read_contacts,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_contacts
    FROM contacts;
END;
$$ LANGUAGE plpgsql;

-- Verify setup by showing table structure and sample data counts
SELECT 'Database setup completed successfully!' as status;
SELECT 'Cycles created: ' || COUNT(*) as cycles_count FROM cycles;
SELECT 'Sample contacts created: ' || COUNT(*) as contacts_count FROM contacts;