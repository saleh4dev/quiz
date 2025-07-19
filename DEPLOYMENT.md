# 🚀 دليل نشر تطبيق MyQuiz

## 📋 المتطلبات المسبقة

- حساب GitHub
- Node.js مثبت على جهازك
- Git مثبت على جهازك

## 🌐 الخيار الأول: Vercel (الأسهل والأسرع)

### الخطوة 1: إنشاء حساب Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر على "Sign Up"
3. اختر "Continue with GitHub"
4. اتبع التعليمات لإكمال التسجيل

### الخطوة 2: رفع المشروع إلى GitHub
```bash
# تهيئة Git (إذا لم تكن موجودة)
git init

# إضافة جميع الملفات
git add .

# عمل commit
git commit -m "Initial commit"

# إنشاء repository على GitHub
# اذهب إلى github.com وأنشئ repository جديد

# ربط المشروع بـ GitHub
git remote add origin https://github.com/yourusername/myquiz.git
git branch -M main
git push -u origin main
```

### الخطوة 3: نشر على Vercel
1. اذهب إلى [vercel.com/dashboard](https://vercel.com/dashboard)
2. انقر على "New Project"
3. اختر repository المشروع
4. اترك الإعدادات الافتراضية
5. انقر على "Deploy"

### الخطوة 4: إعداد المتغيرات البيئية
1. في Vercel Dashboard، اذهب إلى المشروع
2. اذهب إلى "Settings" > "Environment Variables"
3. أضف المتغيرات التالية:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-super-secret-key-here`

## 🌐 الخيار الثاني: Heroku

### الخطوة 1: إنشاء حساب Heroku
1. اذهب إلى [heroku.com](https://heroku.com)
2. انقر على "Sign up"
3. اتبع التعليمات لإكمال التسجيل

### الخطوة 2: تثبيت Heroku CLI
```bash
# على macOS
brew tap heroku/brew && brew install heroku

# على Windows
# حمل من https://devcenter.heroku.com/articles/heroku-cli
```

### الخطوة 3: نشر التطبيق
```bash
# تسجيل الدخول إلى Heroku
heroku login

# إنشاء تطبيق جديد
heroku create myquiz-app

# إضافة متغيرات البيئة
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-key-here

# رفع الكود
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# فتح التطبيق
heroku open
```

## 🌐 الخيار الثالث: DigitalOcean App Platform

### الخطوة 1: إنشاء حساب DigitalOcean
1. اذهب إلى [digitalocean.com](https://digitalocean.com)
2. انقر على "Sign Up"
3. اتبع التعليمات لإكمال التسجيل

### الخطوة 2: نشر التطبيق
1. في DigitalOcean Dashboard، اذهب إلى "Apps"
2. انقر على "Create App"
3. اختر "GitHub" كمصدر للكود
4. اختر repository المشروع
5. اترك الإعدادات الافتراضية
6. انقر على "Create Resources"

## 🔧 إعداد قاعدة البيانات

### للاستخدام المحلي
```bash
# إنشاء قاعدة البيانات
npm run db:reset

# إنشاء حساب الإدارة
npm run admin:create
```

### للإنتاج
- استخدم قاعدة بيانات خارجية مثل PostgreSQL أو MongoDB
- أو استخدم SQLite مع نظام ملفات مستقر

## 🔒 الأمان

### تغيير كلمة مرور الإدارة
1. سجل دخول بحساب الإدارة
2. اذهب إلى لوحة التحكم
3. غير كلمة المرور من إعدادات الحساب

### تحديث JWT_SECRET
```bash
# على Vercel
# اذهب إلى Environment Variables وحدث JWT_SECRET

# على Heroku
heroku config:set JWT_SECRET=new-super-secret-key

# على DigitalOcean
# اذهب إلى App Settings > Environment Variables
```

## 📱 اختبار التطبيق

بعد النشر، اختبر:
- ✅ تسجيل الدخول وإنشاء حساب
- ✅ تصفح الأقسام
- ✅ حل مسابقة
- ✅ لوحة الصدارة
- ✅ لوحة الإدارة

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في قاعدة البيانات**:
   - تأكد من وجود ملف قاعدة البيانات
   - تحقق من صلاحيات الملفات

2. **خطأ في API**:
   - تحقق من متغيرات البيئة
   - تأكد من أن الخادم يعمل

3. **خطأ في الواجهة**:
   - تحقق من أن React build تم بنجاح
   - تأكد من إعدادات Vercel/Heroku

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs في منصة النشر
2. راجع ملف README.md
3. تحقق من إعدادات البيئة 