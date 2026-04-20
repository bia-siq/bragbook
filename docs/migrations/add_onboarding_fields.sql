-- migration: campos para onboarding
alter table profiles
  add column if not exists onboarding_completed boolean default false,
  add column if not exists goal text check (goal in ('promocao', 'mudar_trabalho', 'registrar', 'negociar_salario', 'transicao_carreira', 'outro')),
  add column if not exists goal_other text;

-- goal_other só faz sentido quando goal = 'outro'
alter table profiles
  add constraint goal_other_requires_outro
  check (
    (goal = 'outro' and goal_other is not null and length(trim(goal_other)) > 0)
    or (goal <> 'outro' and goal_other is null)
    or (goal is null)
  );

-- backfill: usuários que já têm perfil preenchido são considerados onboarded
update profiles
  set onboarding_completed = true
  where first_name is not null
    and first_name <> ''
    and onboarding_completed is null;
