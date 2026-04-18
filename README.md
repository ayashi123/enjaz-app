# منصة إنجاز التعليمية

منصة عربية RTL مبنية بـ `Next.js` لإدارة الأداء التعليمي والزيارات الصفية والتقارير الرسمية للقيادة المدرسية.

## التقنيات

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `PostgreSQL / Supabase PostgreSQL`
- `NextAuth`
- `React Hook Form`
- `Zod`
- `Recharts`
- `react-to-print`

## المزايا المنفذة

- تسجيل حساب ودخول بالبريد الإلكتروني وكلمة المرور
- لوحة قيادة عربية مع مؤشرات تنفيذية ورسوم بيانية
- إدارة المعلمين: إضافة، تعديل، حذف، بحث، واستيراد Excel/CSV
- ملف معلم تفصيلي مع سجل التقييمات والأدلة
- محرك تقييم رسمي بالعناصر الـ 11 وحساب نهائي موزون من `5`
- تصنيف الأداء: `مثالي / تخطى التوقعات / وافق التوقعات / بحاجة لتطوير / غير مرضي`
- تغذية راجعة ذكية محلية قابلة للاستبدال لاحقًا بواجهة OpenAI API
- إدارة الأدلة والشواهد وربطها بالمعلم أو التقييم أو عنصر المدير أو الأرشيف العام
- متابعة عناصر المدير وحساب نسبة الإنجاز
- تقارير نهائية قابلة للطباعة مع مناطق التوقيع والختم
- إعدادات المدرسة والطباعة والهوية الرسمية

## تشغيل المشروع

1. تثبيت الاعتماديات:

```bash
npm install
```

بعدها نفّذ فحص الجاهزية:

```bash
npm run doctor
```

2. تشغيل PostgreSQL محليًا:

الخيار الأسرع داخل المشروع:

```bash
npm run db:up
```

هذا يشغّل PostgreSQL عبر `docker compose` على المنفذ `5432`.

إذا لم يكن Docker متاحًا، استخدم PostgreSQL خارجي أو Supabase عبر الملف:

```text
.env.supabase.example
```

2. نسخ متغيرات البيئة:

```bash
copy .env.example .env
```

3. ضع رابط PostgreSQL فعلي في `DATABASE_URL`.

مثال محلي:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/enjaz_platform?schema=public"
```

مثال Supabase:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
```

4. إنشاء Prisma Client:

```bash
npx prisma generate
```

5. تطبيق الهجرات:

```bash
npx prisma migrate deploy
```

أو أثناء التطوير:

```bash
npx prisma migrate dev --name init
```

6. تشغيل البيانات التجريبية:

```bash
npm run prisma:seed
```

7. تشغيل الخادم:

```bash
npm run dev
```

## فحص الجاهزية

- فحص التطبيق:

```text
/api/health
```

- فحص قاعدة البيانات:

```text
/api/db-status
```

## ملاحظات مهمة

- المشروع يحتوي الآن على `prisma.config.ts` وملف migration أولي في:
  - `prisma/migrations/202604170001_init/migration.sql`
- في البيئة الحالية لم تكن خدمة PostgreSQL المحلية متاحة على `localhost:5432`، لذلك يلزم تشغيل PostgreSQL أو توفير رابط Supabase فعلي لإكمال `migrate` و`seed`.
- إذا كان Docker متاحًا لديك فالأسرع هو `npm run db:up` ثم تنفيذ أوامر Prisma.
- إذا لم يكن Docker أو PostgreSQL المحلي متاحًا، استخدم Supabase PostgreSQL وابدأ من `npm run doctor` للتحقق من البيئة.
- البناء الإنتاجي `npm run build` ناجح.

## بيانات دخول seed

عند تشغيل `seed` بنجاح سيتم إنشاء حساب افتراضي:

- البريد: `principal@enjaz.sa`
- كلمة المرور: `Enjaz@12345`
