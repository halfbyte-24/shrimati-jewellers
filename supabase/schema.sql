-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parent Categories
CREATE TABLE parent_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child Categories
CREATE TABLE child_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_category_id UUID NOT NULL REFERENCES parent_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_category_id UUID NOT NULL REFERENCES parent_categories(id) ON DELETE RESTRICT,
    child_category_id UUID NOT NULL REFERENCES child_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    product_code VARCHAR(100),
    description TEXT,
    collection_name VARCHAR(255),
    design_name VARCHAR(255),
    finish VARCHAR(255),
    purity VARCHAR(50),
    weight_value NUMERIC(10, 2),
    weight_unit VARCHAR(20),
    huid VARCHAR(100),
    price NUMERIC(15, 2),
    price_type VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Public Read Access)
ALTER TABLE parent_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to parent_categories" ON parent_categories FOR SELECT USING (true);

ALTER TABLE child_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to child_categories" ON child_categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to published products" ON products FOR SELECT USING (is_published = true);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to product_images" ON product_images FOR SELECT USING (true);
