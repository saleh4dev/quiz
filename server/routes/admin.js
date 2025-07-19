const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/init');

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'رمز الوصول مطلوب'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'صلاحيات غير كافية'
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'رمز الوصول غير صالح'
    });
  }
};

// Get admin dashboard stats
router.get('/dashboard', authenticateAdmin, (req, res) => {
  // Get total users
  db.get('SELECT COUNT(*) as total_users FROM users', (err, usersCount) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    // Get total questions
    db.get('SELECT COUNT(*) as total_questions FROM questions WHERE is_active = 1', (err, questionsCount) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      // Get total quizzes
      db.get('SELECT COUNT(*) as total_quizzes FROM quiz_sessions', (err, quizzesCount) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'خطأ في قاعدة البيانات'
          });
        }

        // Get recent activity
        db.all(`
          SELECT qs.*, u.username, c.name as category_name
          FROM quiz_sessions qs
          JOIN users u ON qs.user_id = u.id
          JOIN categories c ON qs.category_id = c.id
          ORDER BY qs.completed_at DESC
          LIMIT 10
        `, (err, recentActivity) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'خطأ في قاعدة البيانات'
            });
          }

          // Get top users
          db.all(`
            SELECT username, points, level, total_quizzes
            FROM users
            ORDER BY points DESC
            LIMIT 5
          `, (err, topUsers) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'خطأ في قاعدة البيانات'
              });
            }

            res.json({
              success: true,
              dashboard: {
                totalUsers: usersCount.total_users,
                totalQuestions: questionsCount.total_questions,
                totalQuizzes: quizzesCount.total_quizzes,
                recentActivity,
                topUsers
              }
            });
          });
        });
      });
    });
  });
});

// Get all users (admin)
router.get('/users', authenticateAdmin, (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, username, email, role, points, level, total_quizzes, correct_answers, created_at
    FROM users
  `;
  let params = [];

  if (search) {
    query += ' WHERE username LIKE ? OR email LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let countParams = [];

    if (search) {
      countQuery += ' WHERE username LIKE ? OR email LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      res.json({
        success: true,
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Create new question (admin)
router.post('/questions', authenticateAdmin, (req, res) => {
  const { 
    categoryId, 
    questionText, 
    optionA, 
    optionB, 
    optionC, 
    optionD, 
    correctAnswer, 
    difficulty, 
    points, 
    explanation 
  } = req.body;

  if (!categoryId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
    return res.status(400).json({
      success: false,
      message: 'جميع الحقول مطلوبة'
    });
  }

  db.run(`
    INSERT INTO questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, points, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [categoryId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty || 'medium', points || 10, explanation], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في إضافة السؤال'
      });
    }

    res.status(201).json({
      success: true,
      message: 'تم إضافة السؤال بنجاح',
      questionId: this.lastID
    });
  });
});

// Update question (admin)
router.put('/questions/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { 
    categoryId, 
    questionText, 
    optionA, 
    optionB, 
    optionC, 
    optionD, 
    correctAnswer, 
    difficulty, 
    points, 
    explanation,
    isActive 
  } = req.body;

  db.run(`
    UPDATE questions 
    SET category_id = ?, question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, 
        correct_answer = ?, difficulty = ?, points = ?, explanation = ?, is_active = ?
    WHERE id = ?
  `, [categoryId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty, points, explanation, isActive, id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في تحديث السؤال'
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'السؤال غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث السؤال بنجاح'
    });
  });
});

// Delete question (admin)
router.delete('/questions/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM questions WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في حذف السؤال'
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'السؤال غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف السؤال بنجاح'
    });
  });
});

// Create new category (admin)
router.post('/categories', authenticateAdmin, (req, res) => {
  const { name, description, color, icon } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'اسم القسم مطلوب'
    });
  }

  db.run(`
    INSERT INTO categories (name, description, color, icon)
    VALUES (?, ?, ?, ?)
  `, [name, description, color || '#007bff', icon || 'book'], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في إضافة القسم'
      });
    }

    res.status(201).json({
      success: true,
      message: 'تم إضافة القسم بنجاح',
      categoryId: this.lastID
    });
  });
});

// Update category (admin)
router.put('/categories/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, color, icon, isActive } = req.body;

  db.run(`
    UPDATE categories 
    SET name = ?, description = ?, color = ?, icon = ?, is_active = ?
    WHERE id = ?
  `, [name, description, color, icon, isActive, id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في تحديث القسم'
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث القسم بنجاح'
    });
  });
});

// Get system statistics
router.get('/stats', authenticateAdmin, (req, res) => {
  // Get category statistics
  db.all(`
    SELECT 
      c.name,
      c.color,
      COUNT(q.id) as question_count,
      COUNT(DISTINCT qs.user_id) as active_users,
      AVG(qs.score) as avg_score
    FROM categories c
    LEFT JOIN questions q ON c.id = q.category_id AND q.is_active = 1
    LEFT JOIN quiz_sessions qs ON c.id = qs.category_id
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY question_count DESC
  `, (err, categoryStats) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    // Get user growth
    db.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date
    `, (err, userGrowth) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في قاعدة البيانات'
        });
      }

      res.json({
        success: true,
        stats: {
          categoryStats,
          userGrowth
        }
      });
    });
  });
});

module.exports = router; 