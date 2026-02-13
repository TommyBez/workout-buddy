-- Create fitness goals table
CREATE TABLE IF NOT EXISTS public.fitness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_weight_kg NUMERIC,
  days_per_week INTEGER DEFAULT 3,
  preferred_duration_min INTEGER DEFAULT 60,
  equipment_access TEXT[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_select_own" ON public.fitness_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "goals_insert_own" ON public.fitness_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "goals_update_own" ON public.fitness_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "goals_delete_own" ON public.fitness_goals FOR DELETE USING (auth.uid() = user_id);
