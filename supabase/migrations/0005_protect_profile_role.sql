-- ============================================
-- LINQMA — Migration 0005
-- قفل کردن تغییر نقش (role) در پروفایل‌ها
-- نسخهٔ نهایی: SECURITY INVOKER (تایید گروک)
-- ============================================

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('service_role', 'postgres', 'supabase_admin') then
    return new;
  end if;

  if new.id is distinct from old.id then
    raise exception 'changing profile id is not allowed';
  end if;

  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'changing profile role is not allowed';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;

create trigger trg_protect_profile_role
  before update on public.profiles
  for each row
  execute function public.protect_profile_role();