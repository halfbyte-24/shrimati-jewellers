-- 1. Admin Authorization Table
-- You must manually insert your auth.users ID into this table after creating your account.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Secure the admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read own record" ON public.admin_users FOR SELECT USING (auth.uid() = id);

-- Helper function to check if the current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Admin CRUD Policies for Main Tables
-- Parent Categories
CREATE POLICY "Admins can insert parent_categories" ON public.parent_categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update parent_categories" ON public.parent_categories FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete parent_categories" ON public.parent_categories FOR DELETE USING (is_admin());

-- Child Categories
CREATE POLICY "Admins can insert child_categories" ON public.child_categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update child_categories" ON public.child_categories FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete child_categories" ON public.child_categories FOR DELETE USING (is_admin());

-- Products
CREATE POLICY "Admins can select all products" ON public.products FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (is_admin());

-- Product Images
CREATE POLICY "Admins can insert product_images" ON public.product_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update product_images" ON public.product_images FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete product_images" ON public.product_images FOR DELETE USING (is_admin());


-- 3. Storage Bucket Configuration
-- Ensure the storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read images
CREATE POLICY "Public can read product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Admins can insert/update/delete images
CREATE POLICY "Admins can insert product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can update product images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can delete product images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images' AND is_admin());
