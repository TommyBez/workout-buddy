-- Create body metrics table
CREATE TABLE IF NOT EXISTS public.body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  body_fat_pct NUMERIC,
  chest_cm NUMERIC,
  waist_cm NUMERIC,
  hips_cm NUMERIC,
  bicep_cm NUMERIC,
  thigh_cm NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recorded_at)
);

ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "metrics_select_own" ON public.body_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "metrics_insert_own" ON public.body_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "metrics_update_own" ON public.body_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "metrics_delete_own" ON public.body_metrics FOR DELETE USING (auth.uid() = user_id);
