-- Migration to add foto_url to pets table
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS foto_url text NULL;
