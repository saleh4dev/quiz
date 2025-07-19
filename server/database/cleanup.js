const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'quiz.db');
const db = new sqlite3.Database(dbPath);

const cleanupDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('🧹 بدء تنظيف قاعدة البيانات...');
      
      // Clean up duplicate categories
      db.run(`
        DELETE FROM categories 
        WHERE id NOT IN (
          SELECT MIN(id) 
          FROM categories 
          GROUP BY name
        )
      `, function(err) {
        if (err) {
          console.error('❌ خطأ في تنظيف الأقسام:', err);
        } else {
          console.log(`✅ تم حذف ${this.changes} قسم مكرر`);
        }
      });

      // Clean up duplicate questions
      db.run(`
        DELETE FROM questions 
        WHERE id NOT IN (
          SELECT MIN(id) 
          FROM questions 
          GROUP BY question_text
        )
      `, function(err) {
        if (err) {
          console.error('❌ خطأ في تنظيف الأسئلة:', err);
        } else {
          console.log(`✅ تم حذف ${this.changes} سؤال مكرر`);
        }
      });

      // Reset auto-increment counters
      db.run('DELETE FROM sqlite_sequence WHERE name="categories"');
      db.run('DELETE FROM sqlite_sequence WHERE name="questions"');
      
      // Re-insert default categories with correct IDs
      const defaultCategories = [
        { name: 'التاريخ', description: 'أسئلة في التاريخ العربي والعالمي', color: '#dc3545', icon: 'landmark' },
        { name: 'العلوم', description: 'أسئلة في العلوم الطبيعية', color: '#28a745', icon: 'flask' },
        { name: 'الأدب', description: 'أسئلة في الأدب العربي والعالمي', color: '#ffc107', icon: 'book-open' },
        { name: 'الرياضيات', description: 'أسئلة في الرياضيات والهندسة', color: '#17a2b8', icon: 'calculator' },
        { name: 'الجغرافيا', description: 'أسئلة في الجغرافيا والطبيعة', color: '#6f42c1', icon: 'globe' },
        { name: 'الرياضة', description: 'أسئلة في الرياضة والألعاب', color: '#fd7e14', icon: 'futbol' }
      ];

      // Clear existing categories and re-insert
      db.run('DELETE FROM categories', function(err) {
        if (err) {
          console.error('❌ خطأ في حذف الأقسام:', err);
        } else {
          console.log('✅ تم حذف جميع الأقسام');
          
          const insertCategory = db.prepare(`INSERT INTO categories (name, description, color, icon) VALUES (?, ?, ?, ?)`);
          defaultCategories.forEach(cat => {
            insertCategory.run(cat.name, cat.description, cat.color, cat.icon);
          });
          insertCategory.finalize();
          
          console.log(`✅ تم إعادة إدراج ${defaultCategories.length} قسم افتراضي`);
        }
      });

      // Clear existing questions and re-insert with correct category IDs
      db.run('DELETE FROM questions', function(err) {
        if (err) {
          console.error('❌ خطأ في حذف الأسئلة:', err);
        } else {
          console.log('✅ تم حذف جميع الأسئلة');
          
          // Get category IDs
          db.all('SELECT id, name FROM categories', (err, categories) => {
            if (err) {
              console.error('❌ خطأ في جلب الأقسام:', err);
            } else {
              const categoryMap = {};
              categories.forEach(cat => {
                categoryMap[cat.name] = cat.id;
              });
              
              const sampleQuestions = [
                {
                  category_name: 'التاريخ',
                  question_text: 'في أي عام تأسست الدولة العباسية؟',
                  option_a: '750 م',
                  option_b: '661 م',
                  option_c: '909 م',
                  option_d: '1258 م',
                  correct_answer: '750 م',
                  difficulty: 'medium',
                  points: 10
                },
                {
                  category_name: 'العلوم',
                  question_text: 'ما هو العنصر الكيميائي الأكثر وفرة في القشرة الأرضية؟',
                  option_a: 'الحديد',
                  option_b: 'الأكسجين',
                  option_c: 'السيليكون',
                  option_d: 'الألمنيوم',
                  correct_answer: 'الأكسجين',
                  difficulty: 'easy',
                  points: 8
                },
                {
                  category_name: 'الأدب',
                  question_text: 'من هو مؤلف كتاب "ألف ليلة وليلة"؟',
                  option_a: 'مؤلف واحد',
                  option_b: 'مؤلفون متعددون',
                  option_c: 'غير معروف',
                  option_d: 'أحمد شوقي',
                  correct_answer: 'مؤلفون متعددون',
                  difficulty: 'medium',
                  points: 12
                }
              ];

              const insertQuestion = db.prepare(`INSERT INTO questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
              sampleQuestions.forEach(q => {
                const categoryId = categoryMap[q.category_name];
                if (categoryId) {
                  insertQuestion.run(categoryId, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.difficulty, q.points);
                }
              });
              insertQuestion.finalize();
              
              console.log('✅ تم إعادة إدراج الأسئلة الافتراضية');
              console.log('🎉 تم تنظيف قاعدة البيانات بنجاح!');
              resolve();
            }
          });
        }
      });
    });
  });
};

// Run cleanup if this file is executed directly
if (require.main === module) {
  cleanupDatabase()
    .then(() => {
      console.log('✅ تم الانتهاء من تنظيف قاعدة البيانات');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ خطأ في تنظيف قاعدة البيانات:', err);
      process.exit(1);
    });
}

module.exports = { cleanupDatabase }; 