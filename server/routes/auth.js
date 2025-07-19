const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/init');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      if (user) {
        return res.status(400).json({
          success: false,
          message: 'المستخدم موجود مسبقاً'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'خطأ في إنشاء الحساب'
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID, username, role: 'user' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
          );

          res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
              id: this.lastID,
              username,
              email,
              role: 'user',
              points: 0,
              level: 1
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'بيانات الدخول غير صحيحة'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'بيانات الدخول غير صحيحة'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          points: user.points,
          level: user.level,
          total_quizzes: user.total_quizzes,
          correct_answers: user.correct_answers
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'رمز الوصول مطلوب'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    db.get('SELECT id, username, email, role, points, level, total_quizzes, correct_answers FROM users WHERE id = ?', 
      [decoded.userId], (err, user) => {
        if (err || !user) {
          return res.status(404).json({
            success: false,
            message: 'المستخدم غير موجود'
          });
        }

        res.json({
          success: true,
          user
        });
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'رمز الوصول غير صالح'
    });
  }
});

module.exports = router; 