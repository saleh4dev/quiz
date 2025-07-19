# MyQuiz - منصة المسابقات الثقافية التفاعلية

منصة مسابقات تفاعلية باللغة العربية تتيح للمستخدمين المشاركة في مسابقات متنوعة وجمع النقاط.

## 🚀 الميزات

- ✅ تسجيل الدخول وإنشاء حساب
- ✅ مسابقات في أقسام متنوعة (التاريخ، العلوم، الأدب، إلخ)
- ✅ نظام نقاط ومستويات
- ✅ لوحة صدارة للمنافسة
- ✅ لوحة تحكم إدارية
- ✅ واجهة مستخدم متجاوبة

## 🛠️ التثبيت المحلي

```bash
# تثبيت التبعيات
npm run install-all

# تشغيل التطبيق
npm run dev
```

## 🌐 النشر على الإنترنت

### ⚡ النشر السريع (5 دقائق)

```bash
# إعداد المشروع
npm run setup

# رفع المشروع إلى GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/myquiz.git
git push -u origin main

# نشر على Vercel
# 1. اذهب إلى vercel.com وأنشئ حساب
# 2. اربط GitHub
# 3. اختر المشروع وانقر "Deploy"
```

### 🏠 النشر على الموقع الخاص

```bash
# تجهيز الملفات للخادم الخاص
npm run deploy-server

# الملفات ستكون جاهزة في مجلد 'deploy'
# راجع ملف CUSTOM_HOSTING.md للتعليمات المفصلة
# أو راجع QUICK_SERVER_DEPLOY.md للنشر السريع
```

### الخيار الأول: Vercel (الأسهل)

1. **إنشاء حساب على Vercel**:
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل حساب جديد

2. **تجهيز المشروع**:
   ```bash
   npm run build
   ```

3. **رفع المشروع**:
   - ارفع المشروع إلى GitHub
   - اربط حساب Vercel بـ GitHub
   - اختر المشروع وانقر "Deploy"

### الخيار الثاني: Heroku

1. **إنشاء حساب على Heroku**:
   - اذهب إلى [heroku.com](https://heroku.com)
   - سجل حساب جديد

2. **تثبيت Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

3. **نشر التطبيق**:
   ```bash
   heroku login
   heroku create myquiz-app
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### الخيار الثالث: DigitalOcean App Platform

1. **إنشاء حساب على DigitalOcean**:
   - اذهب إلى [digitalocean.com](https://digitalocean.com)
   - سجل حساب جديد

2. **نشر التطبيق**:
   - ارفع المشروع إلى GitHub
   - في DigitalOcean، اختر "App Platform"
   - اربط حساب GitHub واختر المشروع

## 🔧 المتغيرات البيئية

أنشئ ملف `.env` في المجلد الرئيسي:

```env
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key
```

## 👤 حساب الإدارة الافتراضي

- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123`

## 📱 الروابط

### التطوير المحلي:
- **الواجهة الرئيسية**: `http://localhost:3000`
- **لوحة الإدارة**: `http://localhost:3000/admin`

### الإنتاج:
- **الواجهة الرئيسية**: `https://yourdomain.com`
- **لوحة الإدارة**: `https://yourdomain.com/admin`

## 🛡️ الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT للمصادقة
- حماية من CSRF
- Rate limiting
- Helmet للأمان
- HTTPS/SSL support
- Security headers

## 📄 الرخصة

MIT License

## المميزات الرئيسية

### للمستخدمين
- ✅ تسجيل الدخول والتسجيل
- ✅ اختيار الأقسام المختلفة (التاريخ، العلوم، الأدب، الرياضيات، الجغرافيا، الرياضة)
- ✅ نظام مسابقات تفاعلي مع مؤقت زمني
- ✅ نظام نقاط ومستويات
- ✅ لوحة الصدارة
- ✅ إحصائيات مفصلة
- ✅ نظام الإنجازات والشارات
- ✅ تاريخ المسابقات

### للمديرين
- ✅ لوحة تحكم إدارية متكاملة
- ✅ إدارة الأقسام
- ✅ إدارة الأسئلة (إضافة/تعديل/حذف)
- ✅ إدارة المستخدمين
- ✅ إحصائيات النظام
- ✅ مراقبة النشاط

## التقنيات المستخدمة

### الخلفية (Backend)
- **Node.js** مع **Express.js**
- **SQLite** قاعدة بيانات
- **JWT** للمصادقة
- **bcryptjs** لتشفير كلمات المرور

### الواجهة الأمامية (Frontend)
- **React.js**
- **CSS3** مع تصميم متجاوب
- **Font Awesome** للأيقونات

## التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd myQuiz
```

2. **تثبيت التبعيات**
```bash
npm run install-all
```

3. **إعداد البيئة**
```bash
# إنشاء ملف .env
echo "NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" > .env
```

4. **تشغيل المشروع**
```bash
# تشغيل الخادم والواجهة الأمامية معاً
npm run dev

# أو تشغيل كل منهما منفصلاً
npm run server  # الخادم على المنفذ 5000
npm run client  # الواجهة الأمامية على المنفذ 3000
```

## هيكل المشروع

```
myQuiz/
├── server/                 # خادم Node.js
│   ├── database/          # قاعدة البيانات
│   │   └── init.js        # تهيئة قاعدة البيانات
│   ├── routes/            # مسارات API
│   │   ├── auth.js        # المصادقة
│   │   ├── categories.js  # الأقسام
│   │   ├── questions.js   # الأسئلة
│   │   ├── quiz.js        # المسابقات
│   │   ├── users.js       # المستخدمين
│   │   └── admin.js       # لوحة التحكم
│   └── index.js           # نقطة البداية للخادم
├── client/                # تطبيق React
│   ├── src/
│   │   ├── components/    # المكونات
│   │   ├── pages/         # الصفحات
│   │   ├── services/      # خدمات API
│   │   └── utils/         # أدوات مساعدة
│   └── public/
├── package.json
└── README.md
```

## API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - معلومات المستخدم الحالي

### الأقسام
- `GET /api/categories` - جميع الأقسام
- `GET /api/categories/:id` - قسم محدد
- `GET /api/categories/stats/all` - إحصائيات الأقسام

### المسابقات
- `GET /api/quiz/questions/:categoryId` - أسئلة قسم محدد
- `POST /api/quiz/submit` - إرسال إجابات المسابقة
- `GET /api/quiz/history` - تاريخ المسابقات
- `GET /api/quiz/leaderboard` - لوحة الصدارة

### المستخدمين
- `GET /api/users/profile` - الملف الشخصي
- `GET /api/users/stats` - إحصائيات المستخدم
- `GET /api/users/achievements` - الإنجازات
- `PUT /api/users/profile` - تحديث الملف الشخصي

### لوحة التحكم (للمديرين)
- `GET /api/admin/dashboard` - لوحة التحكم الرئيسية
- `GET /api/admin/users` - إدارة المستخدمين
- `POST /api/admin/questions` - إضافة سؤال جديد
- `PUT /api/admin/questions/:id` - تحديث سؤال
- `DELETE /api/admin/questions/:id` - حذف سؤال
- `POST /api/admin/categories` - إضافة قسم جديد

## قاعدة البيانات

### الجداول الرئيسية
- **users** - المستخدمين
- **categories** - الأقسام
- **questions** - الأسئلة
- **quiz_sessions** - جلسات المسابقات
- **quiz_answers** - إجابات المسابقات
- **leaderboard** - لوحة الصدارة

## المساهمة

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى فتح issue في GitHub.

---

**تم التطوير بـ ❤️ للثقافة العربية** 