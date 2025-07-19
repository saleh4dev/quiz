# ⚡ نشر سريع على Vercel

## 🚀 الخطوات السريعة (5 دقائق)

### 1. إنشاء حساب Vercel
- اذهب إلى [vercel.com](https://vercel.com)
- سجل حساب جديد بـ GitHub

### 2. رفع المشروع إلى GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# أنشئ repository على GitHub
git remote add origin https://github.com/yourusername/myquiz.git
git push -u origin main
```

### 3. نشر على Vercel
- اذهب إلى [vercel.com/dashboard](https://vercel.com/dashboard)
- انقر "New Project"
- اختر repository المشروع
- انقر "Deploy"

### 4. إعداد البيئة
- في Vercel Dashboard > المشروع > Settings > Environment Variables
- أضف:
  - `NODE_ENV` = `production`
  - `JWT_SECRET` = `your-secret-key-here`

## ✅ تم! تطبيقك الآن متاح على الإنترنت

### الروابط:
- **الواجهة الرئيسية**: `https://your-app.vercel.app`
- **لوحة الإدارة**: `https://your-app.vercel.app/admin`

### حساب الإدارة:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123`

## 🔧 تحديثات مستقبلية
```bash
git add .
git commit -m "Update app"
git push origin main
# Vercel سيقوم بالتحديث تلقائياً
``` 