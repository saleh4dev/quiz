const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'quiz.db');
const db = new sqlite3.Database(dbPath);

const createAdmin = async () => {
  return new Promise((resolve, reject) => {
    console.log('🔧 إنشاء حساب المدير...');
    
    const adminData = {
      username: 'admin',
      email: 'admin@myquiz.com',
      password: 'admin123',
      role: 'admin'
    };
    
    // تشفير كلمة المرور
    const hashedPassword = bcrypt.hashSync(adminData.password, 10);
    
    // التحقق من وجود المستخدم
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', 
      [adminData.username, adminData.email], (err, user) => {
        if (err) {
          console.error('❌ خطأ في فحص المستخدم:', err);
          reject(err);
          return;
        }
        
        if (user) {
          // تحديث المستخدم الموجود إلى مدير
          db.run('UPDATE users SET role = ? WHERE id = ?', 
            [adminData.role, user.id], function(err) {
              if (err) {
                console.error('❌ خطأ في تحديث المستخدم:', err);
                reject(err);
              } else {
                console.log('✅ تم تحديث المستخدم إلى مدير');
                console.log('📧 البريد الإلكتروني:', adminData.email);
                console.log('🔑 كلمة المرور:', adminData.password);
                resolve();
              }
            });
        } else {
          // إنشاء مستخدم مدير جديد
          db.run(`INSERT INTO users (username, email, password, role, points, level) 
                  VALUES (?, ?, ?, ?, 0, 1)`, 
            [adminData.username, adminData.email, hashedPassword, adminData.role], 
            function(err) {
              if (err) {
                console.error('❌ خطأ في إنشاء المدير:', err);
                reject(err);
              } else {
                console.log('✅ تم إنشاء حساب المدير بنجاح');
                console.log('👤 اسم المستخدم:', adminData.username);
                console.log('📧 البريد الإلكتروني:', adminData.email);
                console.log('🔑 كلمة المرور:', adminData.password);
                console.log('🆔 معرف المستخدم:', this.lastID);
                resolve();
              }
            });
        }
      });
  });
};

// تشغيل إذا تم تنفيذ الملف مباشرة
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log('🎉 تم إنشاء/تحديث المدير بنجاح!');
      console.log('🌐 يمكنك الآن الوصول إلى لوحة التحكم على: http://localhost:3000/admin');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ خطأ في إنشاء المدير:', err);
      process.exit(1);
    });
}

module.exports = { createAdmin }; 