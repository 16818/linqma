-- ============================================
-- LINQMA — Functions (RLS helpers)
-- Migration 0002
-- ============================================

-- ============================================
-- 1. is_admin()
-- بررسی اینکه آیا کاربر جاری نقش admin دارد؟
-- ============================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ============================================
-- 2. is_business_owner(p_business_id uuid)
-- بررسی اینکه آیا کاربر جاری صاحب این کسب‌وکار است؟
-- ============================================
create or replace function public.is_business_owner(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.businesses b
    where b.id = p_business_id
      and b.owner_id = auth.uid()
  );
$$;

-- ============================================
-- 3. is_business_cashier(p_business_id uuid)
-- بررسی اینکه آیا کاربر جاری صندوق‌دار فعال این کسب‌وکار است؟
-- ============================================
create or replace function public.is_business_cashier(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.business_staff s
    where s.business_id = p_business_id
      and s.user_id = auth.uid()
      and s.is_active = true
      and s.role = 'cashier'
  );
$$;

-- ============================================
-- 4. handle_new_user()
-- تریگر: هنگام ثبت‌نام کاربر جدید، پروفایل او را ایجاد می‌کند
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'business_owner',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ============================================
-- Trigger: after insert on auth.users
-- ============================================
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();