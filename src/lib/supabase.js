import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema setup queries (run these in Supabase SQL editor)
export const setupQueries = `
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

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
  admin_notes TEXT,
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

-- Enable Row Level Security (RLS)
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to cycles" ON cycles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reviews" ON cycle_reviews FOR SELECT USING (true);

-- Create policies for contact submissions (allow public to insert, admin to read/update)
CREATE POLICY "Allow public to submit contact forms" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to contact submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for authenticated admin access
CREATE POLICY "Allow admin full access to cycles" ON cycles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to holds" ON cycle_holds FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to reviews" ON cycle_reviews FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
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
 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500', 5);`