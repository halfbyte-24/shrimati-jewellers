-- Seed Data for Srimati Jewelers

-- Clear existing data
TRUNCATE TABLE product_images CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE child_categories CASCADE;
TRUNCATE TABLE parent_categories CASCADE;

-- Insert Parent Categories
INSERT INTO parent_categories (id, name, slug, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Gold', 'gold', 1),
    ('22222222-2222-2222-2222-222222222222', 'Silver', 'silver', 2);

-- Insert Child Categories
INSERT INTO child_categories (id, parent_category_id, name, slug, display_order)
VALUES
    ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Rings', 'gold-rings', 1),
    ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Chains', 'gold-chains', 2),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Earrings', 'gold-earrings', 3),
    ('33333333-3333-3333-3333-333333333334', '11111111-1111-1111-1111-111111111111', 'Necklaces', 'gold-necklaces', 4),
    ('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Rings', 'silver-rings', 1),
    ('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'Anklets', 'silver-anklets', 2);

-- Insert Products
INSERT INTO products (id, parent_category_id, child_category_id, name, slug, product_code, collection_name, design_name, finish, purity, weight_value, weight_unit, huid, is_published, is_featured, price_type)
VALUES
    ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'Sachin Gems Mixed Chain', 'sachin-gems-mixed-chain', 'SJ-GOLD-001', 'Sachin Gems', 'Mixed', 'Highly Polished', '22K', 12.45, 'g', 'ABC123XY', true, true, 'Approx. Price'),
    ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'Classic Gold Ring', 'classic-gold-ring', 'SJ-GOLD-002', 'Heritage Collection', 'Classic', 'Matte', '22K', 4.5, 'g', 'RNG987ZX', true, true, 'Price on Request'),
    ('55555555-5555-5555-5555-555555555553', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444442', 'Elegant Silver Anklet', 'elegant-silver-anklet', 'SJ-SILV-001', 'Everyday Elegance', 'Twisted', 'Polished', '92.5', 15.0, 'g', NULL, true, false, 'Approx. Price');

-- Insert Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
    ('55555555-5555-5555-5555-555555555551', 'https://images.unsplash.com/photo-1599643478524-fb66f7ca065b?auto=format&fit=crop&q=80&w=800', 'Sachin Gems Mixed Chain', true, 1),
    ('55555555-5555-5555-5555-555555555552', 'https://images.unsplash.com/photo-1605100804763-247f67b6348e?auto=format&fit=crop&q=80&w=800', 'Classic Gold Ring', true, 1),
    ('55555555-5555-5555-5555-555555555553', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', 'Elegant Silver Anklet', true, 1);
