#!/bin/bash

echo "🚀 بدء بناء تطبيق MyQuiz..."

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install
cd client && npm install && cd ..

# بناء التطبيق
echo "🔨 بناء التطبيق..."
npm run build

# إنشاء قاعدة البيانات
echo "🗄️ إنشاء قاعدة البيانات..."
npm run db:reset

# إنشاء حساب الإدارة
echo "👤 إنشاء حساب الإدارة..."
npm run admin:create

echo "✅ تم البناء بنجاح!"
echo "🌐 يمكنك الآن نشر التطبيق على Vercel أو Heroku"
echo "📖 راجع ملف DEPLOYMENT.md للتعليمات المفصلة" 