-- Migration: Create Sub Categories (Level 3)
CREATE TABLE IF NOT EXISTS public.sub_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_category_id UUID NOT NULL REFERENCES public.child_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add relationship to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sub_category_id UUID REFERENCES public.sub_categories(id) ON DELETE RESTRICT;

-- Enable RLS
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read-only access to sub_categories" 
ON public.sub_categories FOR SELECT USING (is_active = true);

-- Admin CRUD policies (assuming is_admin() function exists as per earlier migrations)
CREATE POLICY "Admins can insert sub_categories" ON public.sub_categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update sub_categories" ON public.sub_categories FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete sub_categories" ON public.sub_categories FOR DELETE USING (is_admin());

-- Grants
GRANT SELECT ON public.sub_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sub_categories TO authenticated;
