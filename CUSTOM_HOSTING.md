# 🌐 دليل النشر على الموقع الخاص

## 📋 المتطلبات المسبقة

- خادم ويب (VPS أو Dedicated Server)
- Node.js مثبت على الخادم
- Nginx أو Apache مثبت
- SSH access للخادم

## 🚀 الطريقة الأولى: استضافة مشتركة (Shared Hosting)

### للاستضافات التي تدعم Node.js:

1. **تجهيز الملفات:**
   ```bash
   npm run deploy-server
   ```

2. **رفع الملفات:**
   - ارفع محتويات مجلد `deploy` إلى مجلد `public_html` أو `www`
   - ارفع مجلد `server` إلى مجلد خارج `public_html`

3. **إعداد قاعدة البيانات:**
   - إذا كانت الاستضافة تدعم SQLite، استخدم الملف الموجود
   - إذا كانت تدعم MySQL، حول قاعدة البيانات

### للاستضافات التي تدعم PHP فقط:

1. **إنشاء API منفصل:**
   - ارفع الخادم إلى منصة مثل Vercel أو Heroku
   - ارفع الواجهة الأمامية فقط إلى الاستضافة

2. **تحديث API URL:**
   - عدل `client/src/contexts/AuthContext.js`
   - غير `baseURL` إلى رابط API الجديد

## 🚀 الطريقة الثانية: خادم VPS/Dedicated

### باستخدام Docker (الأسهل):

1. **تجهيز الخادم:**
   ```bash
   # ثبت Docker و Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **رفع المشروع:**
   ```bash
   git clone https://github.com/yourusername/myquiz.git
   cd myquiz
   ```

3. **تعديل الإعدادات:**
   - عدل `nginx.conf` وبدل `yourdomain.com` باسم موقعك
   - عدل `docker-compose.yml` وبدل `your-email@domain.com`

4. **تشغيل التطبيق:**
   ```bash
   docker-compose up -d
   ```

### بدون Docker:

1. **تثبيت Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **تثبيت Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

3. **رفع المشروع:**
   ```bash
   git clone https://github.com/yourusername/myquiz.git
   cd myquiz
   npm install
   npm run build
   ```

4. **إعداد Nginx:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/myquiz
   sudo ln -s /etc/nginx/sites-available/myquiz /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **إعداد PM2:**
   ```bash
   sudo npm install -g pm2
   pm2 start server/index.js --name myquiz
   pm2 startup
   pm2 save
   ```

## 🔧 إعداد SSL/HTTPS

### باستخدام Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### باستخدام Docker:

```bash
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/html --email your-email@domain.com --agree-tos --no-eff-email -d yourdomain.com -d www.yourdomain.com
```

## 🗄️ قاعدة البيانات

### SQLite (الافتراضي):
- مناسب للمواقع الصغيرة
- لا يحتاج إعداد إضافي

### MySQL/PostgreSQL:
- مناسب للمواقع الكبيرة
- يحتاج إعداد منفصل

## 🔒 الأمان

### تحديث JWT_SECRET:
```bash
# أنشئ مفتاح قوي
openssl rand -base64 32
```

### إعداد Firewall:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### تحديث النظام:
```bash
sudo apt update && sudo apt upgrade -y
```

## 📊 المراقبة

### باستخدام PM2:
```bash
pm2 monit
pm2 logs myquiz
```

### باستخدام Docker:
```bash
docker-compose logs -f
```

## 🔄 التحديثات

### الطريقة الأولى:
```bash
git pull origin main
npm install
npm run build
pm2 restart myquiz
```

### الطريقة الثانية:
```bash
docker-compose down
git pull origin main
docker-compose up -d --build
```

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في المنفذ:**
   - تأكد من أن المنفذ 5001 متاح
   - تحقق من إعدادات Firewall

2. **خطأ في قاعدة البيانات:**
   - تحقق من صلاحيات الملفات
   - تأكد من وجود مجلد database

3. **خطأ في Nginx:**
   - تحقق من إعدادات nginx.conf
   - راجع logs: `sudo tail -f /var/log/nginx/error.log`

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs الخادم
2. راجع إعدادات Firewall
3. تأكد من صحة إعدادات DNS
4. تحقق من صلاحيات الملفات 