ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_par_q ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_lgpd_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_class_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_class_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_class_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_program_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_session_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY member_profiles_select_own ON public.member_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY member_profiles_update_own ON public.member_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY member_profiles_insert_own ON public.member_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY member_par_q_own ON public.member_par_q
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);
CREATE POLICY member_lgpd_own ON public.member_lgpd_requests
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);
CREATE POLICY member_verification_own ON public.member_verification_codes
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);

CREATE POLICY gym_plans_read ON public.gym_plans
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY member_subscriptions_own ON public.member_subscriptions
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);
CREATE POLICY subscription_payments_own ON public.subscription_payments
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);

CREATE POLICY gym_trainers_read ON public.gym_trainers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY gym_class_settings_read ON public.gym_class_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY gym_class_sessions_read ON public.gym_class_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY member_class_reservations_own ON public.member_class_reservations
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);
CREATE POLICY member_class_waitlist_own ON public.member_class_waitlist
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);

CREATE POLICY member_workout_programs_own ON public.member_workout_programs
  FOR SELECT TO authenticated USING (auth.uid() = member_id);
CREATE POLICY member_workout_exercises_own ON public.member_workout_exercises
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.member_workout_programs p
      WHERE p.id = program_id AND p.member_id = auth.uid()
    )
  );
CREATE POLICY workout_program_edits_own ON public.workout_program_edits
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.member_workout_programs p
      WHERE p.id = program_id AND p.member_id = auth.uid()
    )
  );
CREATE POLICY member_workout_requests_own ON public.member_workout_requests
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);
CREATE POLICY member_workout_sessions_own ON public.member_workout_sessions
  FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);
CREATE POLICY member_workout_session_sets_own ON public.member_workout_session_sets
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.member_workout_sessions s
      WHERE s.id = session_id AND s.member_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.member_workout_sessions s
      WHERE s.id = session_id AND s.member_id = auth.uid()
    )
  );

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.gym_plans TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_par_q TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_lgpd_requests TO authenticated;
GRANT SELECT, INSERT ON public.member_verification_codes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.subscription_payments TO authenticated;
GRANT SELECT ON public.gym_trainers TO authenticated;
GRANT SELECT ON public.gym_class_settings TO authenticated;
GRANT SELECT ON public.gym_class_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_class_reservations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_class_waitlist TO authenticated;
GRANT SELECT ON public.member_workout_programs TO authenticated;
GRANT SELECT ON public.member_workout_exercises TO authenticated;
GRANT SELECT ON public.workout_program_edits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_workout_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.member_workout_sessions TO authenticated;
GRANT SELECT, INSERT ON public.member_workout_session_sets TO authenticated;
