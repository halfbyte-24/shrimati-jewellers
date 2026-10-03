-- Migration: 03_create_store_settings.sql
-- Description: Creates a singleton table to manage public-facing store details.

CREATE TABLE IF NOT EXISTS public.store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Enforce singleton pattern
    store_name VARCHAR(255) NOT NULL DEFAULT 'Shrimati Jewellers',
    tagline VARCHAR(255),
    short_description TEXT,
    description TEXT,
    
    phone VARCHAR(50),
    secondary_phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    enquiry_email VARCHAR(255),
    
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    locality VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(50),
    country VARCHAR(100) DEFAULT 'India',
    google_maps_url TEXT,
    
    business_hours JSONB DEFAULT '{}'::jsonb,
    
    instagram_url TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    whatsapp_url TEXT,
    
    website_title VARCHAR(255),
    meta_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to store_settings" 
ON public.store_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update store_settings" 
ON public.store_settings FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can insert store_settings" 
ON public.store_settings FOR INSERT WITH CHECK (is_admin());

-- PostgreSQL Table Privileges
GRANT SELECT ON public.store_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.store_settings TO authenticated;

-- Initialize the singleton row if it doesn't already exist
INSERT INTO public.store_settings (id, store_name) 
VALUES (1, 'Shrimati Jewellers') 
ON CONFLICT (id) DO NOTHING;
