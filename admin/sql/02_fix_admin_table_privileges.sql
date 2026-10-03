-- Migration: 02_fix_admin_table_privileges.sql
-- Description: Grants proper PostgreSQL table privileges to the authenticated role so that Supabase RLS can evaluate policies.

-- 1. Grant SELECT to both anon (public) and authenticated users.
-- RLS policies will still filter what they can actually see.
GRANT SELECT ON public.parent_categories TO anon, authenticated;
GRANT SELECT ON public.child_categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;

-- 2. Grant mutation privileges to the authenticated role.
-- Note: This does NOT mean any authenticated user can mutate data. 
-- It simply allows PostgreSQL to pass the query to the Row Level Security (RLS) engine.
-- The existing RLS policies (e.g. WITH CHECK (is_admin())) will then block non-admins.
GRANT INSERT, UPDATE, DELETE ON public.parent_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.child_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_images TO authenticated;

-- Optional: Ensure admin_users has correct privileges for the admin check
GRANT SELECT ON public.admin_users TO authenticated;
