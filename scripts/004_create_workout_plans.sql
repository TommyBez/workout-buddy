-- Create workout plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal_id UUID REFERENCES public.fitness_goals(id),
  days_per_week INTEGER,
  is_active BOOLEAN DEFAULT true,
  plan_data JSONB NOT NULL,
  feedback_summary TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_own" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "plans_insert_own" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "plans_update_own" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "plans_delete_own" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);
