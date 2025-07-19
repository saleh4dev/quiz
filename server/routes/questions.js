const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Get all questions (with pagination)
router.get('/', (req, res) => {
  const { page = 1, limit = 20, categoryId, difficulty } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT q.*, c.name as category_name, c.color as category_color
    FROM questions q
    JOIN categories c ON q.category_id = c.id
    WHERE q.is_active = 1
  `;
  let params = [];

  if (categoryId) {
    query += ' AND q.category_id = ?';
    params.push(categoryId);
  }

  if (difficulty && difficulty !== 'all') {
    query += ' AND q.difficulty = ?';
    params.push(difficulty);
  }

  query += ' ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, questions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM questions q WHERE q.is_active = 1';
    let countParams = [];

    if (categoryId) {
      countQuery += ' AND q.category_id = ?';
      countParams.push(categoryId);
    }

    if (difficulty && difficulty !== 'all') {
      countQuery += ' AND q.difficulty = ?';
      countParams.push(difficulty);
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
        questions,
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

// Add new question
router.post('/', (req, res) => {
  const { 
    question, 
    option1, 
    option2, 
    option3, 
    option4, 
    correct_answer, 
    category_id, 
    difficulty = 'medium', 
    points = 10 
  } = req.body;

  // Validation
  if (!question || !option1 || !option2 || !option3 || !option4 || !correct_answer || !category_id) {
    return res.status(400).json({
      success: false,
      message: 'جميع الحقول مطلوبة'
    });
  }

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: 'مستوى الصعوبة غير صحيح'
    });
  }

  db.run(`
    INSERT INTO questions (
      question_text, 
      option_a, 
      option_b, 
      option_c, 
      option_d, 
      correct_answer, 
      category_id, 
      difficulty, 
      points, 
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `, [
    question, 
    option1, 
    option2, 
    option3, 
    option4, 
    correct_answer, 
    category_id, 
    difficulty, 
    points
  ], function(err) {
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

// Update question
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { 
    question, 
    option1, 
    option2, 
    option3, 
    option4, 
    correct_answer, 
    category_id, 
    difficulty, 
    points 
  } = req.body;

  // Validation
  if (!question || !option1 || !option2 || !option3 || !option4 || !correct_answer || !category_id) {
    return res.status(400).json({
      success: false,
      message: 'جميع الحقول مطلوبة'
    });
  }

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: 'مستوى الصعوبة غير صحيح'
    });
  }

  db.run(`
    UPDATE questions SET 
      question_text = ?, 
      option_a = ?, 
      option_b = ?, 
      option_c = ?, 
      option_d = ?, 
      correct_answer = ?, 
      category_id = ?, 
      difficulty = ?, 
      points = ?
    WHERE id = ? AND is_active = 1
  `, [
    question, 
    option1, 
    option2, 
    option3, 
    option4, 
    correct_answer, 
    category_id, 
    difficulty, 
    points, 
    id
  ], function(err) {
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

// Delete question (soft delete)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE questions SET is_active = 0 WHERE id = ?',
    [id],
    function(err) {
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
    }
  );
});

// Get question by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT q.*, c.name as category_name, c.color as category_color
    FROM questions q
    JOIN categories c ON q.category_id = c.id
    WHERE q.id = ? AND q.is_active = 1
  `, [id], (err, question) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'السؤال غير موجود'
      });
    }

    res.json({
      success: true,
      question
    });
  });
});

// Get questions by category
router.get('/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { difficulty, limit = 10 } = req.query;

  let query = `
    SELECT id, question_text, option_a, option_b, option_c, option_d, difficulty, points
    FROM questions 
    WHERE category_id = ? AND is_active = 1
  `;
  let params = [categoryId];

  if (difficulty && difficulty !== 'all') {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  query += ' ORDER BY RANDOM() LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, questions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json({
      success: true,
      questions,
      total: questions.length
    });
  });
});

// Get question statistics
router.get('/:id/stats', (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT 
      q.*,
      COUNT(qa.id) as total_attempts,
      SUM(CASE WHEN qa.is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts,
      AVG(qa.time_taken) as avg_time,
      AVG(qa.points_earned) as avg_points
    FROM questions q
    LEFT JOIN quiz_answers qa ON q.id = qa.question_id
    WHERE q.id = ? AND q.is_active = 1
    GROUP BY q.id
  `, [id], (err, stats) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'السؤال غير موجود'
      });
    }

    const accuracy = stats.total_attempts > 0 
      ? Math.round((stats.correct_attempts / stats.total_attempts) * 100) 
      : 0;

    res.json({
      success: true,
      stats: {
        ...stats,
        accuracy,
        difficulty_rate: accuracy < 30 ? 'صعب' : accuracy < 70 ? 'متوسط' : 'سهل'
      }
    });
  });
});

module.exports = router; 