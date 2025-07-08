-- Queen&apos;s Glam Supabase Database Schema
-- Comprehensive schema for beauty salon management system

-- ========================================
-- CLEANUP: DROP EXISTING TABLES AND VIEWS
-- ========================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS product_ratings CASCADE;
DROP VIEW IF EXISTS todays_appointments CASCADE;
DROP VIEW IF EXISTS out_of_stock_products CASCADE;
DROP VIEW IF EXISTS dashboard_overview CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_customer_loyalty_points(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_appointment_end_time(TIME, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS check_appointment_availability(DATE, TIME, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_customer_total_spent() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS sales_analytics CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS appointment_services CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- SETUP: ENABLE EXTENSIONS
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- CORE TABLES
-- ========================================

-- Users table (for admin/staff access)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'manager')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'France',
    notes TEXT,
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PRODUCTS & INVENTORY
-- ========================================

-- Product categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    in_stock BOOLEAN DEFAULT true,
    weight_grams DECIMAL(8,2),
    dimensions_cm VARCHAR(50),
    brand VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- ========================================
-- SERVICES
-- ========================================

-- Service categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- APPOINTMENTS & SCHEDULING
-- ========================================



-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    deposit_paid BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointment services (for multiple services per appointment)
CREATE TABLE appointment_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ORDERS & SALES
-- ========================================

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255), -- For guest orders
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_for_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL, -- Store name in case product is deleted
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- REVIEWS & FEEDBACK
-- ========================================

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255), -- For anonymous reviews
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LOYALTY & PROMOTIONS
-- ========================================

-- Loyalty program
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    points INTEGER NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions/Coupons
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- NOTIFICATIONS & COMMUNICATIONS
-- ========================================

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('appointment_reminder', 'appointment_details_update', 'order_update', 'promotion', 'birthday', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- ANALYTICS & REPORTING
-- ========================================

-- Sales analytics
CREATE TABLE sales_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_sales DECIMAL(12,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    total_customers INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_sku ON products(sku);

-- Appointments
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_status ON appointments(appointment_date, status);

-- Orders
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Inventory
-- CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
-- CREATE INDEX idx_inventory_date ON inventory_movements(created_at);
-- CREATE INDEX idx_inventory_type ON inventory_movements(movement_type);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_service ON reviews(service_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ========================================
-- TRIGGERS FOR AUTOMATION
-- ========================================



-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'QG-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                       LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') || '-' ||
                       LPAD((SELECT COALESCE(MAX(SUBSTRING(order_number FROM 12)::INTEGER), 0) + 1 
                             FROM orders 
                             WHERE order_number LIKE 'QG-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                                   LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') || '-%')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Update customer total spent
CREATE OR REPLACE FUNCTION update_customer_total_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE customers 
        SET total_spent = total_spent + NEW.total_amount,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_total_spent
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_total_spent();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Basic policies (you can customize these based on your needs)
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Staff can view all customers" ON customers
    FOR ALL USING (true);

CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage products" ON products
    FOR ALL USING (true);

CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage services" ON services
    FOR ALL USING (true);

CREATE POLICY "Staff can manage appointments" ON appointments
    FOR ALL USING (true);

CREATE POLICY "Staff can manage orders" ON orders
    FOR ALL USING (true);

CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert sample product categories
INSERT INTO product_categories (name, description, slug) VALUES
('Lip Gloss', 'Produits de brillance et hydratation pour les lèvres', 'lip-gloss'),
('Masques à Lèvres', 'Masques de soin spécialisés pour les lèvres', 'masques-levres'),
('Perruques Naturelles', 'Perruques haut de gamme en cheveux naturels', 'perruques');

-- Insert sample service categories
INSERT INTO service_categories (name, description, slug) VALUES
('Soins du visage', 'Services de soin et beauté du visage', 'soins-visage'),
('Maquillage', 'Services de maquillage professionnel', 'maquillage'),
('Manucure & Pédicure', 'Services de soin des mains et pieds', 'manucure-pedicure'),
('Pose de Perruques', 'Services de pose et entretien de perruques', 'pose-perruques');

-- Insert sample services
INSERT INTO services (name, description, category_id, price, duration_minutes) VALUES
('Manucure & Pédicure', 'Pose d''ongles et soins complets pour mains et pieds', 
 (SELECT id FROM service_categories WHERE slug = 'manucure-pedicure'), 45.00, 60),
('Pose de Perruques', 'Pose de perruques pour un rendu impeccable', 
 (SELECT id FROM service_categories WHERE slug = 'pose-perruques'), 35.00, 45),
('Coiffure de Perruques', 'Coiffure de perruques selon votre style', 
 (SELECT id FROM service_categories WHERE slug = 'pose-perruques'), 25.00, 30),
('Soins de Perruques', 'Remise à neuf pour redonner vie à votre favorite', 
 (SELECT id FROM service_categories WHERE slug = 'pose-perruques'), 40.00, 60);

-- Insert sample products with detailed information matching the mock data
INSERT INTO products (name, description, short_description, category_id, price, in_stock, is_featured, sku, brand) VALUES
('Lip Gloss Ultra Hydratant', 'Vegan et sans cruauté animale, il hydrate intensément tout en laissant un fini glowy et soyeux. Disponible en 10 teintes sublimes pour tous les tons de peau.', 'Fais briller tes lèvres avec notre gloss signature ✨', 
 (SELECT id FROM product_categories WHERE slug = 'lip-gloss'), 12.99, true, true, 'QG-LG-001', 'Queen&apos;s Glam'),
('Lip Gloss Fini Matte', 'Notre gamme matte offre une couleur intense et une tenue longue durée, sans dessécher les lèvres. Disponible en 2 teintes élégantes.', 'L''élégance du matte, sans compromis sur le confort.', 
 (SELECT id FROM product_categories WHERE slug = 'lip-gloss'), 12.99, true, false, 'QG-LG-002', 'Queen&apos;s Glam'),
('Lip Gloss Brillant', 'Effet miroir intense pour des lèvres ultra brillantes et glamour.', 'Brillance maximale pour un look impactant', 
 (SELECT id FROM product_categories WHERE slug = 'lip-gloss'), 14.99, true, false, 'QG-LG-003', 'Queen&apos;s Glam'),
('Masque à Lèvres', 'Ce masque à lèvres riche et fondant est un soin de nuit pour des lèvres réparées et repulpées au réveil. Disponible en 3 saveurs gourmandes : fraise, bonbon et vanille.', 'Ton rituel self-care du soir commence ici.', 
 (SELECT id FROM product_categories WHERE slug = 'masques-levres'), 12.99, true, true, 'QG-ML-001', 'Queen&apos;s Glam'),
('Masque à Lèvres Exfoliant', 'Masque exfoliant doux pour éliminer les peaux mortes et révéler des lèvres plus douces.', 'Exfoliation douce pour des lèvres parfaites', 
 (SELECT id FROM product_categories WHERE slug = 'masques-levres'), 15.99, true, false, 'QG-ML-002', 'Queen&apos;s Glam'),
('Perruques Naturelles Premium', 'Confort, élégance et durabilité réunis dans des modèles pensés pour t''accompagner en toute confiance. Disponibles en plusieurs textures : lisse, ondulée, bouclée, kinky, afro etc. Options : Lace frontale, sans colle, avec colle, personnalisables à la demande.', 'Révèle ton style avec nos perruques 100 % cheveux naturels.', 
 (SELECT id FROM product_categories WHERE slug = 'perruques'), NULL, true, true, 'QG-PN-001', 'Queen&apos;s Glam'),
('Perruques Lace Front', 'Perruques avec lace frontale pour un rendu ultra naturel et une pose facile.', 'Lace frontale pour un rendu naturel parfait', 
 (SELECT id FROM product_categories WHERE slug = 'perruques'), NULL, true, false, 'QG-PN-002', 'Queen&apos;s Glam');

-- Insert sample reviews for products
INSERT INTO reviews (customer_name, product_id, rating, title, comment, is_verified, is_approved) VALUES
('Marie L.', (SELECT id FROM products WHERE sku = 'QG-LG-001'), 5, 'Excellent produit!', 'Texture parfaite, pas collante du tout. Je recommande!', true, true),
('Sophie M.', (SELECT id FROM products WHERE sku = 'QG-LG-001'), 4, 'Très satisfaite', 'Hydratation intense, parfum subtil. Parfait pour l''hiver.', true, true),
('Emma R.', (SELECT id FROM products WHERE sku = 'QG-LG-002'), 5, 'Fini matte parfait', 'Couleur intense, tenue longue durée. Exactement ce que je cherchais.', true, true),
('Julie D.', (SELECT id FROM products WHERE sku = 'QG-ML-001'), 5, 'Masque miracle', 'Mes lèvres sont transformées après une nuit. Incroyable!', true, true),
('Camille L.', (SELECT id FROM products WHERE sku = 'QG-PN-001'), 5, 'Perruque exceptionnelle', 'Qualité premium, confort incroyable. Je me sens magnifique!', true, true),
('Lisa M.', (SELECT id FROM products WHERE sku = 'QG-LG-003'), 4, 'Brillance intense', 'Effet miroir parfait, parfait pour les soirées!', true, true),
('Sarah K.', (SELECT id FROM products WHERE sku = 'QG-ML-002'), 5, 'Exfoliation douce', 'Exfoliation parfaite, mes lèvres sont plus douces que jamais.', true, true),
('Anna P.', (SELECT id FROM products WHERE sku = 'QG-PN-002'), 4, 'Lace frontale parfaite', 'Rendu ultra naturel, pose facile. Très satisfaite!', true, true);

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Dashboard overview view
CREATE VIEW dashboard_overview AS
SELECT 
    (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as orders_last_30_days,
    (SELECT COUNT(*) FROM appointments WHERE appointment_date >= CURRENT_DATE) as upcoming_appointments,
    (SELECT COUNT(*) FROM customers WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_customers_last_30_days,
    (SELECT COUNT(*) FROM reviews WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as reviews_last_30_days,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as revenue_last_30_days;

-- Out of stock products view
CREATE VIEW out_of_stock_products AS
SELECT 
    p.id,
    p.name,
    p.sku,
    pc.name as category_name
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
WHERE p.in_stock = false AND p.is_active = true;

-- Today's appointments view
CREATE VIEW todays_appointments AS
SELECT 
    a.id,
    a.appointment_date,
    a.start_time,
    a.end_time,
    a.status,
    c.first_name || ' ' || c.last_name as customer_name,
    c.phone as customer_phone,
    s.name as service_name
FROM appointments a
LEFT JOIN customers c ON a.customer_id = c.id
LEFT JOIN services s ON a.service_id = s.id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.start_time;

-- Product ratings and reviews view
CREATE VIEW product_ratings AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.price,
    p.in_stock,
    p.is_featured,
    p.short_description,
    p.description,
    p.brand,
    pc.name as category_name,
    pc.slug as category_slug,
    ROUND(AVG(r.rating), 1) as average_rating,
    COUNT(r.id) as review_count
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
WHERE p.is_active = true
GROUP BY p.id, p.name, p.sku, p.price, p.in_stock, p.is_featured, p.short_description, p.description, p.brand, pc.name, pc.slug;

-- ========================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ========================================

-- Function to check appointment availability
CREATE OR REPLACE FUNCTION check_appointment_availability(
    p_appointment_date DATE,
    p_start_time TIME,
    p_duration_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_end_time TIME;
    v_conflicting_appointments INTEGER;
BEGIN
    v_end_time := p_start_time + (p_duration_minutes || ' minutes')::INTERVAL;
    
    -- Check for conflicting appointments
    SELECT COUNT(*) INTO v_conflicting_appointments
    FROM appointments
    WHERE appointment_date = p_appointment_date
      AND status NOT IN ('cancelled', 'no_show')
      AND (
          (start_time < v_end_time AND end_time > p_start_time)
      );
    
    RETURN v_conflicting_appointments = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate appointment end time
CREATE OR REPLACE FUNCTION calculate_appointment_end_time(
    p_start_time TIME,
    p_duration_minutes INTEGER
)
RETURNS TIME AS $$
BEGIN
    RETURN p_start_time + (p_duration_minutes || ' minutes')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Function to get customer loyalty points
CREATE OR REPLACE FUNCTION get_customer_loyalty_points(p_customer_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_points INTEGER;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN transaction_type = 'earned' THEN points
            WHEN transaction_type IN ('redeemed', 'expired') THEN -points
            ELSE 0
        END
    ), 0) INTO v_points
    FROM loyalty_transactions
    WHERE customer_id = p_customer_id;
    
    RETURN v_points;
END;
$$ LANGUAGE plpgsql; 