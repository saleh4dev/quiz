const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/init');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'رمز الوصول مطلوب'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'رمز الوصول غير صالح'
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح لك بالوصول'
    });
  }
};

// Get all users (admin only)
router.get('/all', authenticateToken, isAdmin, (req, res) => {
  db.all(`
    SELECT id, username, email, role, points, level, total_quizzes, correct_answers, created_at
    FROM users 
    ORDER BY created_at DESC
  `, (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json(users);
  });
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(`
    SELECT id, username, email, role, points, level, total_quizzes, correct_answers, created_at
    FROM users 
    WHERE id = ?
  `, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    if (!user) {
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
});

// Get user statistics
router.get('/stats', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Get basic stats
  db.get(`
    SELECT points, level, total_quizzes, correct_answers
    FROM users 
    WHERE id = ?
  `, [userId], (err, basicStats) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    // Get category-wise stats
    db.all(`
      SELECT 
        c.name as category_name,
        c.color as category_color,
        COUNT(qs.id) as quizzes_count,
        AVG(qs.score) as avg_score,
        MAX(qs.score) as best_score,
        SUM(qs.correct_answers) as total_correct
      FROM quiz_sessions qs
      JOIN categories c ON qs.category_id = c.id
      WHERE qs.user_id = ?
      GROUP BY c.id
      ORDER BY quizzes_count DESC
    `, [userId], (err, categoryStats) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      // Get recent activity
      db.all(`
        SELECT qs.*, c.name as category_name, c.color as category_color
        FROM quiz_sessions qs
        JOIN categories c ON qs.category_id = c.id
        WHERE qs.user_id = ?
        ORDER BY qs.completed_at DESC
        LIMIT 5
      `, [userId], (err, recentActivity) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'خطأ في قاعدة البيانات'
          });
        }

        // Calculate accuracy
        const accuracy = basicStats.total_quizzes > 0 
          ? Math.round((basicStats.correct_answers / basicStats.total_quizzes) * 100) 
          : 0;

        res.json({
          success: true,
          stats: {
            ...basicStats,
            accuracy,
            categoryStats,
            recentActivity
          }
        });
      });
    });
  });
});

// Get user achievements
router.get('/achievements', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(`
    SELECT points, level, total_quizzes, correct_answers
    FROM users 
    WHERE id = ?
  `, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    const achievements = [];

    // Level achievements
    if (user.level >= 1) achievements.push({ name: 'مبتدئ', description: 'الوصول للمستوى الأول', icon: '🌟', unlocked: true });
    if (user.level >= 5) achievements.push({ name: 'متقدم', description: 'الوصول للمستوى الخامس', icon: '⭐', unlocked: true });
    if (user.level >= 10) achievements.push({ name: 'خبير', description: 'الوصول للمستوى العاشر', icon: '👑', unlocked: true });

    // Quiz achievements
    if (user.total_quizzes >= 1) achievements.push({ name: 'أول خطوة', description: 'إكمال أول مسابقة', icon: '🎯', unlocked: true });
    if (user.total_quizzes >= 10) achievements.push({ name: 'منافس نشط', description: 'إكمال 10 مسابقات', icon: '🏆', unlocked: true });
    if (user.total_quizzes >= 50) achievements.push({ name: 'محترف', description: 'إكمال 50 مسابقة', icon: '💎', unlocked: true });

    // Points achievements
    if (user.points >= 100) achievements.push({ name: 'جامع النقاط', description: 'جمع 100 نقطة', icon: '💰', unlocked: true });
    if (user.points >= 500) achievements.push({ name: 'ثري', description: 'جمع 500 نقطة', icon: '💎', unlocked: true });
    if (user.points >= 1000) achievements.push({ name: 'مليونير', description: 'جمع 1000 نقطة', icon: '👑', unlocked: true });

    // Accuracy achievements
    const accuracy = user.total_quizzes > 0 ? (user.correct_answers / user.total_quizzes) * 100 : 0;
    if (accuracy >= 80) achievements.push({ name: 'دقيق', description: 'دقة 80% أو أكثر', icon: '🎯', unlocked: true });
    if (accuracy >= 90) achievements.push({ name: 'مثالي', description: 'دقة 90% أو أكثر', icon: '💯', unlocked: true });

    res.json({
      success: true,
      achievements,
      totalAchievements: achievements.length
    });
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      message: 'اسم المستخدم والبريد الإلكتروني مطلوبان'
    });
  }

  // Check if username or email already exists
  db.get('SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?', 
    [username, email, userId], (err, existingUser) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'اسم المستخدم أو البريد الإلكتروني مستخدم مسبقاً'
        });
      }

      // Update user
      db.run(`
        UPDATE users 
        SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [username, email, userId], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'خطأ في تحديث الملف الشخصي'
          });
        }

        res.json({
          success: true,
          message: 'تم تحديث الملف الشخصي بنجاح'
        });
      });
    });
});

// Get user ranking
router.get('/ranking', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(`
    SELECT 
      u.username,
      u.points,
      u.level,
      (SELECT COUNT(*) + 1 FROM users WHERE points > u.points) as rank
    FROM users u
    WHERE u.id = ?
  `, [userId], (err, ranking) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json({
      success: true,
      ranking
    });
  });
});

module.exports = router; 