#!/bin/bash

echo "🚀 نشر تطبيق MyQuiz على Vercel..."

# بناء التطبيق
echo "🔨 بناء التطبيق..."
npm run build

# إضافة الملفات إلى Git
echo "📝 إضافة الملفات إلى Git..."
git add .

# عمل commit
echo "💾 عمل commit..."
git commit -m "Deploy to production"

# رفع إلى GitHub
echo "⬆️ رفع إلى GitHub..."
git push origin main

echo "✅ تم الرفع بنجاح!"
echo "🌐 Vercel سيقوم بالنشر تلقائياً"
echo "📱 تحقق من رابط التطبيق في Vercel Dashboard" 