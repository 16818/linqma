# LINQMA — راهنمای بازسازی از صفر

## پیش‌نیازها
- Node.js 20+
- حساب Supabase
- Git

## ۱. کلون و نصب
git clone https://github.com/16818/linqma.git
cd linqma
npm install

## ۲. پروژه Supabase جدید
یک پروژه جدید در supabase.com بسازید.

## ۳. اجرای Migrationها
در SQL Editor به ترتیب اجرا کنید:
1. supabase/migrations/0001_schema.sql
2. supabase/migrations/0002_functions.sql
3. supabase/migrations/0003_rls.sql
4. supabase/migrations/0004_grants_storage.sql

## ۴. تنظیم Auth
در Authentication → URL Configuration:
- Site URL: http://localhost:3000
- Redirect URLs: http://localhost:3000/auth/reset-password

## ۵. فایل .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

## ۶. اولین ادمین
در Authentication → Users یک کاربر بسازید. سپس در SQL Editor:
update public.profiles set role = 'admin' where email = 'your-email@example.com';

## ۷. اجرا
npm run dev

## ۸. تست دود
1. ورود ادمین → /admin
2. ساخت کسب‌وکار
3. ورود صاحب کسب‌وکار
4. ساخت محصول و انتشار
5. ویترین → /business/[slug]
6. ثبت سفارش
7. صندوق → /dashboard/pos
8. تأیید سفارش
9. ساخت صندوق‌دار در تنظیمات