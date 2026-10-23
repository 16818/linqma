-- ============================================
-- LINQMA — RLS Policies
-- Migration 0003
-- ============================================

-- ============================================
-- 1. profiles
-- ============================================
alter table public.profiles enable row level security;

-- کاربر می‌تواند پروفایل خودش را ببیند
drop policy if exists "کاربر می‌تواند پروفایل خودش را ببیند" on public.profiles;
create policy "کاربر می‌تواند پروفایل خودش را ببیند"
  on public.profiles for select to public
  using (auth.uid() = id);

-- کاربر می‌تواند پروفایل خودش را ویرایش کند
drop policy if exists "کاربر می‌تواند پروفایل خودش را ویرایش کند" on public.profiles;
create policy "کاربر می‌تواند پروفایل خودش را ویرایش کند"
  on public.profiles for update to public
  using (auth.uid() = id);

-- ادمین می‌تواند همه پروفایل‌ها را بخواند
drop policy if exists "admin can read all profiles" on public.profiles;
create policy "admin can read all profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

-- owner می‌تواند پروفایل صندوق‌دار خودش را بخواند
drop policy if exists "owner_read_cashier_profiles" on public.profiles;
create policy "owner_read_cashier_profiles"
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1 from public.business_staff s
      join public.businesses b on b.id = s.business_id
      where s.user_id = profiles.id
        and b.owner_id = auth.uid()
    )
  );

-- ============================================
-- 2. businesses
-- ============================================
alter table public.businesses enable row level security;

-- صاحب کسب‌وکار می‌تواند کسب‌وکار خودش را مدیریت کند
drop policy if exists "صاحب کسب‌وکار می‌تواند کسب‌وکار خودش را مدیریت کند" on public.businesses;
create policy "صاحب کسب‌وکار می‌تواند کسب‌وکار خودش را مدیریت کند"
  on public.businesses for all to public
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- مشاهده کسب‌وکارهای منتشرشده (عمومی)
drop policy if exists "مشاهده کسب‌وکارهای منتشر شده" on public.businesses;
create policy "مشاهده کسب‌وکارهای منتشر شده"
  on public.businesses for select to public
  using (is_published = true or owner_id = auth.uid());

-- ادمین: همه عملیات
drop policy if exists "admin can select all businesses" on public.businesses;
create policy "admin can select all businesses"
  on public.businesses for select to authenticated
  using (public.is_admin());

drop policy if exists "admin can insert businesses" on public.businesses;
create policy "admin can insert businesses"
  on public.businesses for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin can update all businesses" on public.businesses;
create policy "admin can update all businesses"
  on public.businesses for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin can delete all businesses" on public.businesses;
create policy "admin can delete all businesses"
  on public.businesses for delete to authenticated
  using (public.is_admin());

-- صندوق‌دار: خواندن کسب‌وکار متصل
drop policy if exists "cashier_select_own_business" on public.businesses;
create policy "cashier_select_own_business"
  on public.businesses for select to authenticated
  using (public.is_business_cashier(id));

-- عمومی: خواندن کسب‌وکارهای منتشرشده
drop policy if exists "public_read_published_businesses" on public.businesses;
create policy "public_read_published_businesses"
  on public.businesses for select to anon, authenticated
  using (is_published = true);

-- ============================================
-- 3. categories
-- ============================================
alter table public.categories enable row level security;

-- صاحب کسب‌وکار: مدیریت دسته‌بندی‌ها
drop policy if exists "صاحب کسب‌وکار می‌تواند دسته‌بندی‌ها را مدیریت کند" on public.categories;
create policy "صاحب کسب‌وکار می‌تواند دسته‌بندی‌ها را مدیریت کند"
  on public.categories for all to public
  using (
    exists (
      select 1 from public.businesses b
      where b.id = categories.business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = categories.business_id and b.owner_id = auth.uid()
    )
  );

-- مشاهده دسته‌بندی‌های کسب‌وکارهای منتشرشده (عمومی)
drop policy if exists "مشاهده دسته‌بندی کسب‌وکارهای منتشر شده" on public.categories;
create policy "مشاهده دسته‌بندی کسب‌وکارهای منتشر شده"
  on public.categories for select to public
  using (
    exists (
      select 1 from public.businesses b
      where b.id = categories.business_id and b.is_published = true
    )
  );

-- ============================================
-- 4. products
-- ============================================
alter table public.products enable row level security;

-- صاحب کسب‌وکار: مدیریت محصولات
drop policy if exists "صاحب کسب‌وکار می‌تواند محصولات خود را مدیریت کند" on public.products;
create policy "صاحب کسب‌وکار می‌تواند محصولات خود را مدیریت کند"
  on public.products for all to public
  using (
    exists (
      select 1 from public.businesses b
      where b.id = products.business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = products.business_id and b.owner_id = auth.uid()
    )
  );

-- مشاهده محصولات کسب‌وکارهای منتشرشده (عمومی)
drop policy if exists "مشاهده محصولات کسب‌وکارهای منتشر شده" on public.products;
create policy "مشاهده محصولات کسب‌وکارهای منتشر شده"
  on public.products for select to public
  using (
    exists (
      select 1 from public.businesses b
      where b.id = products.business_id and b.is_published = true
    )
  );

-- ============================================
-- 5. orders
-- ============================================
alter table public.orders enable row level security;

-- ادمین: خواندن همه سفارش‌ها
drop policy if exists "admin can select all orders" on public.orders;
create policy "admin can select all orders"
  on public.orders for select to authenticated
  using (public.is_admin());

-- owner یا cashier: خواندن سفارش‌های کسب‌وکار
drop policy if exists "orders select owner or cashier" on public.orders;
create policy "orders select owner or cashier"
  on public.orders for select to authenticated
  using (
    public.is_business_owner(business_id)
    or public.is_business_cashier(business_id)
  );

-- owner یا cashier: به‌روزرسانی سفارش‌ها
drop policy if exists "orders update owner or cashier" on public.orders;
create policy "orders update owner or cashier"
  on public.orders for update to authenticated
  using (
    public.is_business_owner(business_id)
    or public.is_business_cashier(business_id)
  )
  with check (
    public.is_business_owner(business_id)
    or public.is_business_cashier(business_id)
  );

-- فقط owner: حذف سفارش
drop policy if exists "orders delete owner only" on public.orders;
create policy "orders delete owner only"
  on public.orders for delete to authenticated
  using (public.is_business_owner(business_id));

-- عمومی: ثبت سفارش برای کسب‌وکارهای منتشرشده
drop policy if exists "public insert order" on public.orders;
create policy "public insert order"
  on public.orders for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.is_published = true
    )
  );

-- ============================================
-- 6. business_staff
-- ============================================
alter table public.business_staff enable row level security;

-- owner: مدیریت staff
drop policy if exists "owner_all_business_staff" on public.business_staff;
create policy "owner_all_business_staff"
  on public.business_staff for all to authenticated
  using (public.is_business_owner(business_id))
  with check (public.is_business_owner(business_id));

-- cashier: خواندن ردیف خودش
drop policy if exists "cashier_select_own_staff_row" on public.business_staff;
create policy "cashier_select_own_staff_row"
  on public.business_staff for select to authenticated
  using (user_id = auth.uid() and is_active = true);

-- ============================================
-- 7. order_access_codes
-- ============================================
alter table public.order_access_codes enable row level security;

-- owner: مدیریت کدهای اشتراک
drop policy if exists "owner manage access codes" on public.order_access_codes;
create policy "owner manage access codes"
  on public.order_access_codes for all to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = order_access_codes.business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = order_access_codes.business_id and b.owner_id = auth.uid()
    )
  );

-- ============================================
-- 8. order_rate_limits
-- ============================================
alter table public.order_rate_limits enable row level security;

-- هیچ پالیسی برای anon/authenticated (فقط service_role دسترسی دارد)