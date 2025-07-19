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

// Get quiz questions for a category
router.get('/questions/:categoryId', authenticateToken, (req, res) => {
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

    // Shuffle options for each question
    const shuffledQuestions = questions.map(q => {
      const options = [q.option_a, q.option_b, q.option_c, q.option_d];
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      
      return {
        id: q.id,
        question_text: q.question_text,
        options: shuffledOptions,
        difficulty: q.difficulty,
        points: q.points
      };
    });

    res.json({
      success: true,
      questions: shuffledQuestions,
      total: shuffledQuestions.length
    });
  });
});

// Submit quiz answers
router.post('/submit', authenticateToken, (req, res) => {
  const { categoryId, answers, timeTaken } = req.body;
  const userId = req.user.userId;

  if (!categoryId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة'
    });
  }

  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Create quiz session
    db.run(`
      INSERT INTO quiz_sessions (user_id, category_id, total_questions, time_taken)
      VALUES (?, ?, ?, ?)
    `, [userId, categoryId, answers.length, timeTaken], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({
          success: false,
          message: 'خطأ في حفظ النتائج'
        });
      }

      const sessionId = this.lastID;
      let totalScore = 0;
      let correctAnswers = 0;
      let processedAnswers = 0;

      // Process each answer
      answers.forEach((answer, index) => {
        db.get(`
          SELECT correct_answer, points 
          FROM questions 
          WHERE id = ?
        `, [answer.questionId], (err, question) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({
              success: false,
              message: 'خطأ في معالجة الإجابات'
            });
          }

          const isCorrect = question.correct_answer === answer.selectedAnswer;
          const pointsEarned = isCorrect ? question.points : 0;
          
          if (isCorrect) {
            correctAnswers++;
            totalScore += pointsEarned;
          }

          // Save answer
          db.run(`
            INSERT INTO quiz_answers (session_id, question_id, user_answer, is_correct, time_taken, points_earned)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [sessionId, answer.questionId, answer.selectedAnswer, isCorrect, answer.timeTaken || 0, pointsEarned]);

          processedAnswers++;

          // If all answers processed, finalize
          if (processedAnswers === answers.length) {
            // Update session with final results
            db.run(`
              UPDATE quiz_sessions 
              SET score = ?, correct_answers = ?
              WHERE id = ?
            `, [totalScore, correctAnswers, sessionId], (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({
                  success: false,
                  message: 'خطأ في تحديث النتائج'
                });
              }

              // Update user stats
              db.run(`
                UPDATE users 
                SET points = points + ?, 
                    total_quizzes = total_quizzes + 1,
                    correct_answers = correct_answers + ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
              `, [totalScore, correctAnswers, userId], (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({
                    success: false,
                    message: 'خطأ في تحديث إحصائيات المستخدم'
                  });
                }

                // Update user level based on points
                db.get('SELECT points FROM users WHERE id = ?', [userId], (err, user) => {
                  if (!err && user) {
                    const newLevel = Math.floor(user.points / 100) + 1;
                    db.run('UPDATE users SET level = ? WHERE id = ?', [newLevel, userId]);
                  }

                  db.run('COMMIT');

                  res.json({
                    success: true,
                    message: 'تم حفظ النتائج بنجاح',
                    results: {
                      sessionId,
                      totalScore,
                      correctAnswers,
                      totalQuestions: answers.length,
                      accuracy: Math.round((correctAnswers / answers.length) * 100),
                      timeTaken
                    }
                  });
                });
              });
            });
          }
        });
      });
    });
  });
});

// Get user quiz history
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { limit = 10, offset = 0 } = req.query;

  db.all(`
    SELECT qs.*, c.name as category_name, c.color as category_color
    FROM quiz_sessions qs
    JOIN categories c ON qs.category_id = c.id
    WHERE qs.user_id = ?
    ORDER BY qs.completed_at DESC
    LIMIT ? OFFSET ?
  `, [userId, parseInt(limit), parseInt(offset)], (err, sessions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json({
      success: true,
      sessions
    });
  });
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  const { categoryId, limit = 10 } = req.query;

  let query = `
    SELECT u.username, u.points, u.level, u.total_quizzes,
           COUNT(DISTINCT qs.id) as category_quizzes,
           AVG(qs.score) as avg_score
    FROM users u
    LEFT JOIN quiz_sessions qs ON u.id = qs.user_id
  `;

  let params = [];

  if (categoryId) {
    query += ' WHERE qs.category_id = ?';
    params.push(categoryId);
  }

  query += `
    GROUP BY u.id
    ORDER BY u.points DESC, u.level DESC
    LIMIT ?
  `;
  params.push(parseInt(limit));

  db.all(query, params, (err, leaderboard) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json({
      success: true,
      leaderboard
    });
  });
});

// Get category leaderboard
router.get('/leaderboard/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { limit = 10 } = req.query;

  db.all(`
    SELECT u.username, u.points, u.level,
           COUNT(qs.id) as category_quizzes,
           AVG(qs.score) as avg_score,
           MAX(qs.score) as best_score
    FROM users u
    JOIN quiz_sessions qs ON u.id = qs.user_id
    WHERE qs.category_id = ?
    GROUP BY u.id
    ORDER BY AVG(qs.score) DESC, COUNT(qs.id) DESC
    LIMIT ?
  `, [categoryId, parseInt(limit)], (err, leaderboard) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json({
      success: true,
      leaderboard
    });
  });
});

module.exports = router; 