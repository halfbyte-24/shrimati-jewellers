-- Migration: Add is_active to categories
ALTER TABLE public.parent_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.child_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- (Optional) Update existing public read policies if you only want active categories to be visible to the public:
-- DROP POLICY IF EXISTS "Allow public read-only access to parent_categories" ON public.parent_categories;
-- CREATE POLICY "Allow public read-only access to parent_categories" ON public.parent_categories FOR SELECT USING (is_active = true);
-- 
-- DROP POLICY IF EXISTS "Allow public read-only access to child_categories" ON public.child_categories;
-- CREATE POLICY "Allow public read-only access to child_categories" ON public.child_categories FOR SELECT USING (is_active = true);
