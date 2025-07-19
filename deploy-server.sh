#!/bin/bash

echo "🚀 نشر تطبيق MyQuiz على الخادم الخاص..."

# بناء التطبيق
echo "🔨 بناء التطبيق..."
npm run build

# إنشاء قاعدة البيانات
echo "🗄️ إنشاء قاعدة البيانات..."
npm run db:reset

# إنشاء حساب الإدارة
echo "👤 إنشاء حساب الإدارة..."
npm run admin:create

# إنشاء مجلد للنشر
echo "📁 إنشاء مجلد النشر..."
mkdir -p deploy
cp -r client/build/* deploy/
cp -r server deploy/
cp package*.json deploy/
cp nginx.conf deploy/
cp docker-compose.yml deploy/
cp Dockerfile deploy/

# إنشاء ملف .env للإنتاج
echo "🔧 إنشاء ملف البيئة..."
cat > deploy/.env << EOF
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF

# نسخ ملفات إضافية
echo "📋 نسخ ملفات إضافية..."
cp pm2.config.js deploy/
cp myquiz.service deploy/
cp QUICK_SERVER_DEPLOY.md deploy/

echo "✅ تم تجهيز الملفات للنشر!"
echo "📁 الملفات جاهزة في مجلد 'deploy'"
echo "🌐 ارفع محتويات مجلد 'deploy' إلى خادمك"
echo ""
echo "📋 الخطوات التالية:"
echo "1. ارفع محتويات مجلد 'deploy' إلى خادمك"
echo "2. ثبت Node.js على الخادم"
echo "3. شغل 'npm install' في مجلد المشروع"
echo "4. شغل 'pm2 start pm2.config.js --env production'"
echo "5. اضبط Nginx أو Apache حسب إعدادات خادمك"
echo ""
echo "📖 راجع ملف QUICK_SERVER_DEPLOY.md للتعليمات السريعة" 