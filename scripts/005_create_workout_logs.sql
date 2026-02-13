-- Create workout logs table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.workout_plans(id),
  workout_day TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  duration_min INTEGER,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  notes TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_select_own" ON public.workout_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "logs_insert_own" ON public.workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "logs_update_own" ON public.workout_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "logs_delete_own" ON public.workout_logs FOR DELETE USING (auth.uid() = user_id);
