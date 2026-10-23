-- ============================================
-- LINQMA — Grants & Storage
-- Migration 0004
-- ============================================

-- ============================================
-- 1. GRANTs برای جداول (برای تغییرات آینده Supabase)
-- ============================================
grant select on public.businesses to anon;
grant select, insert, update, delete on public.businesses to authenticated;
grant select, insert, update, delete on public.businesses to service_role;

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.products to service_role;

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.categories to service_role;

grant select, insert on public.orders to anon;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.orders to service_role;

grant select on public.profiles to anon;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

grant select, insert, update, delete on public.business_staff to authenticated;
grant select, insert, update, delete on public.business_staff to service_role;

grant select, insert, update, delete on public.order_access_codes to authenticated;
grant select, insert, update, delete on public.order_access_codes to service_role;

grant select, insert, update, delete on public.order_rate_limits to service_role;

-- ============================================
-- 2. Storage Buckets
-- ============================================

-- Bucket: products (برای عکس محصولات)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Bucket: logos (برای لوگوی کسب‌وکار)
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Bucket: covers (برای کاور کسب‌وکار)
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- ============================================
-- 3. Storage Policies
-- ============================================

-- خواندن عمومی عکس‌ها
drop policy if exists "همه می‌توانند عکس‌ها را ببینند" on storage.objects;
create policy "همه می‌توانند عکس‌ها را ببینند"
  on storage.objects for select to public
  using (bucket_id in ('products', 'logos', 'covers'));

-- آپلود توسط کاربران لاگین‌شده
drop policy if exists "کاربران می‌توانند عکس آپلود کنند" on storage.objects;
create policy "کاربران می‌توانند عکس آپلود کنند"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('products', 'logos', 'covers'));

-- به‌روزرسانی توسط کاربران لاگین‌شده
drop policy if exists "کاربران می‌توانند عکس خود را به‌روزرسانی کنند" on storage.objects;
create policy "کاربران می‌توانند عکس خود را به‌روزرسانی کنند"
  on storage.objects for update to authenticated
  using (bucket_id in ('products', 'logos', 'covers'));

-- حذف توسط کاربران لاگین‌شده
drop policy if exists "کاربران می‌توانند عکس خود را حذف کنند" on storage.objects;
create policy "کاربران می‌توانند عکس خود را حذف کنند"
  on storage.objects for delete to authenticated
  using (bucket_id in ('products', 'logos', 'covers'));