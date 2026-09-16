INSERT INTO storage.buckets (id, name, public)
VALUES
  ('member-photos', 'member-photos', true),
  ('member-documents', 'member-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS gymx_photos_public_read ON storage.objects;
CREATE POLICY gymx_photos_public_read ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'member-photos');

DROP POLICY IF EXISTS gymx_photos_own_write ON storage.objects;
CREATE POLICY gymx_photos_own_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'member-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS gymx_photos_own_update ON storage.objects;
CREATE POLICY gymx_photos_own_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'member-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS gymx_docs_own_read ON storage.objects;
CREATE POLICY gymx_docs_own_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'member-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS gymx_docs_own_write ON storage.objects;
CREATE POLICY gymx_docs_own_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'member-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

INSERT INTO public.gym_plans (
  id, name, slug, badge, description, monthly_price, loyalty_months,
  penalty_percent, freeze_days_per_cycle, checkins_per_month, schedule_label,
  benefits, sort_order, active
) VALUES
  (
    'livre', 'Plano Livre', 'livre', 'Essencial',
    'Para quem quer autonomia com estrutura',
    290, 3, 20, 7, 12, 'Horário comercial',
    ARRAY[
      'Acesso à academia em horário comercial',
      'Avaliação física de entrada',
      'Protocolo de treino inicial',
      'Acesso a toda a área de equipamentos',
      'App de acompanhamento de treino'
    ],
    1, true
  ),
  (
    'plus', 'Plano Plus', 'plus', 'Mais escolhido',
    'Para quem quer resultado com acompanhamento',
    490, 3, 20, 15, NULL, 'Horário completo',
    ARRAY[
      'Acesso à academia em horário completo',
      'Avaliação física completa',
      'Protocolo individual personalizado',
      '4 sessões mensais com coach dedicado',
      'Acesso a todas as aulas em grupo'
    ],
    2, true
  ),
  (
    'elite', 'Plano Elite', 'elite', 'Alto desempenho',
    'Para quem não aceita menos que o máximo',
    890, 3, 20, 30, NULL, 'Acesso 24h',
    ARRAY[
      'Acesso 24h à academia',
      'Avaliação física e funcional completa',
      'Protocolo de periodização avançada',
      'Acompanhamento ilimitado com coach',
      'Área de recuperação VIP'
    ],
    3, true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gym_class_settings (
  id, unit_name, booking_open_days, booking_close_minutes, cancel_limit_hours,
  checkin_before_minutes, checkin_after_minutes, max_no_shows_period,
  no_show_period_days, booking_block_days, waitlist_confirm_minutes
) VALUES (
  'main', 'GYMX Cerqueira César', 7, 30, 8, 30, 15, 3, 30, 7, 30
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gym_trainers (full_name, cref, email, specialties)
SELECT 'Lucas Andrade', 'CREF 000000-G/SP', 'lucas.andrade@gymx.com.br',
       ARRAY['Força', 'Levantamento Olímpico']
WHERE NOT EXISTS (SELECT 1 FROM public.gym_trainers);
