-- Migration: 05_add_contact_fields_to_store_settings.sql
-- Description: Adds languages_spoken, payment_options, and parking fields to store_settings table.

ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS languages_spoken JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS payment_options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS parking VARCHAR(255) DEFAULT '';

-- Seed with sensible defaults if empty
UPDATE public.store_settings
SET languages_spoken = '["English", "Hindi"]'::jsonb
WHERE languages_spoken IS NULL OR jsonb_array_length(languages_spoken) = 0;

UPDATE public.store_settings
SET payment_options = '["RTGS", "NEFT", "UPI", "Cash", "Cards", "Online Wallets", "Gift Card"]'::jsonb
WHERE payment_options IS NULL OR jsonb_array_length(payment_options) = 0;

UPDATE public.store_settings
SET parking = 'Street Parking'
WHERE parking IS NULL OR parking = '';
