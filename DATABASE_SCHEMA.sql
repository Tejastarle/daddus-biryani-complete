-- ========================================
-- DADDU'S BIRYANI - DATABASE SCHEMA
-- ========================================
-- Run this in Supabase SQL Editor
-- It creates all tables and sample data
-- ========================================

-- LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  is_veg BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS menu_items_category_idx ON menu_items(category);

-- BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  category TEXT,
  author TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);
CREATE INDEX IF NOT EXISTS blogs_category_idx ON blogs(category);

-- GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SAMPLE DATA
-- ========================================

INSERT INTO leads (name, email, phone, service, message, status) VALUES
('Evelyn Brown', 'evelyn@example.com', '7348758555', 'Catering', 'Interested in bulk order for 100 guests', 'new'),
('Shristi Kumar', 'shristi@example.com', '9979553686', 'Delivery', 'Regular biryani delivery for office', 'qualified'),
('Omar Hashem', 'omar@example.com', '+1 2027135039', 'Dine-in', 'Amazing experience at your restaurant', 'contacted')
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, price, category, is_veg) VALUES
('Hyderabadi Chicken Biryani', 'Authentic Hyderabadi style with fragrant basmati rice', 280.00, 'chicken', false),
('Mutton Biryani', 'Tender mutton with aromatic spices', 350.00, 'mutton', false),
('Vegetable Biryani', 'Mixed vegetables with biryani spices', 180.00, 'veg', true),
('Paneer Biryani', 'Cottage cheese with seasonal vegetables', 220.00, 'veg', true),
('Fish Biryani', 'Fresh fish with aromatic spices', 320.00, 'seafood', false),
('Dum Chicken Biryani', 'Slow-cooked chicken biryani', 300.00, 'chicken', false)
ON CONFLICT DO NOTHING;

INSERT INTO blogs (title, slug, excerpt, category, author, status, content) VALUES
('The Art of Making Perfect Biryani', 'art-of-biryani', 'Learn the secrets behind creating perfect biryani', 'Recipes', 'Chef Daddu', 'published', 'Full article content here...'),
('Health Benefits of Biryani Spices', 'health-benefits', 'Discover health benefits of biryani spices', 'Health', 'Dr. Sarah', 'published', 'Full article content here...'),
('Biryani Around the World', 'biryani-worldwide', 'Explore how biryani has evolved globally', 'Culture', 'Food Writer', 'published', 'Full article content here...')
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (name, rating, review, featured) VALUES
('Rajesh Kumar', 5, 'Best biryani in Mumbai! Authentic flavor and great service.', true),
('Priya Singh', 5, 'Amazing quality and quick delivery!', true),
('Ahmed Khan', 5, 'Worth every penny. Highly recommended!', false),
('Neha Patel', 5, 'Fresh ingredients and perfect cooking.', false)
ON CONFLICT DO NOTHING;

-- ========================================
-- SUCCESS
-- ========================================
-- All tables created successfully!
-- Sample data inserted.
-- You're ready to use the website!
