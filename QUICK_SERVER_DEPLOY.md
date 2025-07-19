# ⚡ نشر سريع على الخادم الخاص

## 🚀 الطريقة الأسرع (10 دقائق)

### 1. تجهيز الملفات
```bash
npm run deploy-server
```

### 2. رفع الملفات للخادم
- ارفع محتويات مجلد `deploy` إلى خادمك
- أو استخدم SCP:
```bash
scp -r deploy/* user@your-server:/var/www/html/
```

### 3. إعداد الخادم
```bash
# تسجيل دخول للخادم
ssh user@your-server

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت PM2
sudo npm install -g pm2

# تشغيل التطبيق
cd /var/www/html
npm install
pm2 start server/index.js --name myquiz
pm2 startup
pm2 save
```

### 4. إعداد Nginx
```bash
# تثبيت Nginx
sudo apt update
sudo apt install nginx

# نسخ إعدادات Nginx
sudo cp nginx.conf /etc/nginx/sites-available/myquiz
sudo ln -s /etc/nginx/sites-available/myquiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. إعداد SSL (اختياري)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## ✅ تم! تطبيقك الآن متاح على موقعك

### الروابط:
- **الواجهة الرئيسية**: `https://yourdomain.com`
- **لوحة الإدارة**: `https://yourdomain.com/admin`

### حساب الإدارة:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123`

## 🔧 التحديثات المستقبلية
```bash
# على الخادم
cd /var/www/html
git pull origin main
npm install
npm run build
pm2 restart myquiz
```

## 🆘 استكشاف الأخطاء

### إذا لم يعمل التطبيق:
1. تحقق من PM2: `pm2 status`
2. راجع الـ logs: `pm2 logs myquiz`
3. تحقق من Nginx: `sudo nginx -t`
4. راجع logs Nginx: `sudo tail -f /var/log/nginx/error.log`

### إذا لم يعمل HTTPS:
1. تحقق من إعدادات SSL
2. تأكد من صحة DNS
3. راجع logs Certbot: `sudo certbot certificates` 