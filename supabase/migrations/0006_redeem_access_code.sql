-- ============================================
-- LINQMA — Migration 0006
-- RPC اتمی برای اعتبارسنجی و مصرف کد اشتراک
-- ============================================

create or replace function public.redeem_order_access_code(
  p_business_id uuid,
  p_code text
)
returns table (
  ok boolean,
  message text,
  code_id uuid,
  code_text text,
  kind text,
  discount_percent integer,
  table_no text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.order_access_codes%rowtype;
begin
  select c.*
  into r
  from public.order_access_codes c
  where c.business_id = p_business_id
    and lower(c.code) = lower(trim(p_code))
    and c.is_active = true
  for update;

  if not found then
    return query select false, 'کد نامعتبر است.', null::uuid, null::text, null::text, null::integer, null::text;
    return;
  end if;

  if r.expires_at is not null and r.expires_at < now() then
    return query select false, 'کد منقضی شده است.', null::uuid, null::text, null::text, null::integer, null::text;
    return;
  end if;

  if r.max_uses is not null and r.used_count >= r.max_uses then
    return query select false, 'سقف استفاده از این کد پر شده است.', null::uuid, null::text, null::text, null::integer, null::text;
    return;
  end if;

  update public.order_access_codes
    set used_count = used_count + 1
    where id = r.id
      and (max_uses is null or used_count < max_uses);

  if not found then
    return query select false, 'سقف استفاده از این کد پر شده است.', null::uuid, null::text, null::text, null::integer, null::text;
    return;
  end if;

  return query select
    true,
    'ok'::text,
    r.id,
    r.code,
    r.kind,
    r.discount_percent,
    r.table_no;
end;
$$;

revoke all on function public.redeem_order_access_code(uuid, text) from public;
grant execute on function public.redeem_order_access_code(uuid, text)
  to service_role;