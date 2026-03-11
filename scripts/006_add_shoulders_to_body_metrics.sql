-- Add shoulders measurement support for existing body_metrics tables
ALTER TABLE public.body_metrics
ADD COLUMN IF NOT EXISTS shoulders_cm NUMERIC;
