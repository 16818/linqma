-- ============================================
-- LINQMA — Schema (Tables)
-- Migration 0001
-- ============================================

-- Extension for UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. profiles
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'business_owner',
  created_at timestamptz not null default timezone('utc'::text, now()),
  email text,
  constraint profiles_role_check check (role in ('admin', 'business_owner', 'cashier'))
);

-- ============================================
-- 2. businesses
-- ============================================
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  address text,
  phone text,
  working_hours text,
  logo_url text,
  cover_url text,
  is_published boolean default false,
  plan text default 'basic',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  instagram text,
  whatsapp text,
  maps_url text,
  telegram text,
  rubika text,
  eitaa text,
  bale text,
  order_require_phone boolean default false,
  order_max_per_window integer default 5,
  order_window_seconds integer default 300
);

-- ============================================
-- 3. categories
-- ============================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  icon text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- ============================================
-- 4. products
-- ============================================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price integer not null,
  image_url text,
  badge text,
  ingredients text[],
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  is_featured boolean default false,
  is_popular boolean default false,
  is_available boolean default true,
  discount_price integer,
  is_featured_today boolean default false
);

-- ============================================
-- 5. orders
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  short_code text not null,
  items jsonb not null,
  total integer not null,
  status text default 'pending',
  created_at timestamptz default now(),
  customer_name text,
  customer_phone text,
  customer_note text,
  table_number text,
  access_code_id uuid,
  access_code_text text
);

-- ============================================
-- 6. business_staff
-- ============================================
create table if not exists public.business_staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'cashier' check (role in ('cashier')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  email text,
  unique (business_id, user_id)
);

-- ============================================
-- 7. order_access_codes
-- ============================================
create table if not exists public.order_access_codes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null,
  kind text not null default 'store' check (kind in ('store', 'table', 'member')),
  label text,
  table_no text,
  discount_percent integer check (discount_percent is null or (discount_percent >= 0 and discount_percent <= 100)),
  is_active boolean not null default true,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, code)
);

-- ============================================
-- 8. order_rate_limits
-- ============================================
create table if not exists public.order_rate_limits (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_key text not null,
  window_start timestamptz not null default now(),
  order_count integer not null default 1
);

-- ============================================
-- Indexes
-- ============================================
create index if not exists business_staff_user_idx on public.business_staff (user_id);
create index if not exists business_staff_business_idx on public.business_staff (business_id);
create index if not exists order_access_codes_business_idx on public.order_access_codes (business_id);
create index if not exists order_rate_limits_lookup on public.order_rate_limits (business_id, client_key, window_start desc);
create index if not exists orders_business_id_idx on public.orders (business_id);
create index if not exists products_business_id_idx on public.products (business_id);
create index if not exists categories_business_id_idx on public.categories (business_id);