-- Migration: 04_create_offers.sql
-- Description: Creates the offers table for dynamic promotional offers.

CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to active offers" 
ON public.offers FOR SELECT 
USING (
    is_active = true 
    AND (starts_at IS NULL OR starts_at <= NOW()) 
    AND (ends_at IS NULL OR ends_at >= NOW())
);

CREATE POLICY "Admins can view all offers" 
ON public.offers FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update offers" 
ON public.offers FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can insert offers" 
ON public.offers FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can delete offers" 
ON public.offers FOR DELETE USING (is_admin());

-- PostgreSQL Table Privileges
GRANT SELECT ON public.offers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.offers TO authenticated;
