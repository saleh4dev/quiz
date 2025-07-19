const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Get all categories
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories WHERE is_active = 1 ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json(categories);
  });
});

// Add new category
router.post('/', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'اسم القسم مطلوب'
    });
  }

  db.run(
    'INSERT INTO categories (name, description, is_active) VALUES (?, ?, 1)',
    [name, description || ''],
    function(err) {
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
    }
  );
});

// Update category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'اسم القسم مطلوب'
    });
  }

  db.run(
    'UPDATE categories SET name = ?, description = ? WHERE id = ? AND is_active = 1',
    [name, description || '', id],
    function(err) {
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
    }
  );
});

// Delete category (soft delete)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE categories SET is_active = 0 WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'خطأ في حذف القسم'
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
        message: 'تم حذف القسم بنجاح'
      });
    }
  );
});

// Get category by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM categories WHERE id = ? AND is_active = 1', [id], (err, category) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    res.json({
      success: true,
      category
    });
  });
});

// Get category with question count
router.get('/:id/stats', (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT c.*, COUNT(q.id) as question_count 
    FROM categories c 
    LEFT JOIN questions q ON c.id = q.category_id AND q.is_active = 1
    WHERE c.id = ? AND c.is_active = 1
    GROUP BY c.id
  `, [id], (err, category) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }

    res.json({
      success: true,
      category
    });
  });
});

// Get all categories with question counts
router.get('/stats/all', (req, res) => {
  db.all(`
    SELECT c.*, COUNT(q.id) as question_count 
    FROM categories c 
    LEFT JOIN questions q ON c.id = q.category_id AND q.is_active = 1
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.name
  `, (err, categories) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    res.json({
      success: true,
      categories
    });
  });
});

module.exports = router; 