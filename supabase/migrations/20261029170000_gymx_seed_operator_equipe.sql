INSERT INTO gym_academy.platform_operators (user_id, full_name)
SELECT p.staff_id, coalesce(nullif(sp.full_name, ''), 'Operação GYMX')
FROM gym_academy.personal_public_profiles p
JOIN gym_academy.staff_profiles sp ON sp.id = p.staff_id
WHERE p.slug = 'equipe-gymx'
ON CONFLICT (user_id) DO NOTHING;
