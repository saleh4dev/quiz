const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'quiz.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        total_quizzes INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Categories table
      db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT DEFAULT '#007bff',
        icon TEXT DEFAULT 'book',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Questions table
      db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        difficulty TEXT DEFAULT 'medium',
        points INTEGER DEFAULT 10,
        explanation TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`);

      // Quiz sessions table
      db.run(`CREATE TABLE IF NOT EXISTS quiz_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        score INTEGER DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        time_taken INTEGER DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`);

      // Quiz answers table
      db.run(`CREATE TABLE IF NOT EXISTS quiz_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        user_answer TEXT,
        is_correct BOOLEAN DEFAULT 0,
        time_taken INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES quiz_sessions (id),
        FOREIGN KEY (question_id) REFERENCES questions (id)
      )`);

      // Leaderboard table (for caching)
      db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category_id INTEGER,
        total_points INTEGER DEFAULT 0,
        total_quizzes INTEGER DEFAULT 0,
        average_score REAL DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`);

      // Insert default categories
      const defaultCategories = [
        { name: 'التاريخ', description: 'أسئلة في التاريخ العربي والعالمي', color: '#dc3545', icon: 'landmark' },
        { name: 'العلوم', description: 'أسئلة في العلوم الطبيعية', color: '#28a745', icon: 'flask' },
        { name: 'الأدب', description: 'أسئلة في الأدب العربي والعالمي', color: '#ffc107', icon: 'book-open' },
        { name: 'الرياضيات', description: 'أسئلة في الرياضيات والهندسة', color: '#17a2b8', icon: 'calculator' },
        { name: 'الجغرافيا', description: 'أسئلة في الجغرافيا والطبيعة', color: '#6f42c1', icon: 'globe' },
        { name: 'الرياضة', description: 'أسئلة في الرياضة والألعاب', color: '#fd7e14', icon: 'futbol' }
      ];

      // Check if categories already exist
      db.get('SELECT COUNT(*) as count FROM categories', (err, result) => {
        if (err) {
          console.error('❌ خطأ في فحص الأقسام:', err);
        } else if (result.count === 0) {
          // Only insert if no categories exist
          const insertCategory = db.prepare(`INSERT INTO categories (name, description, color, icon) VALUES (?, ?, ?, ?)`);
          defaultCategories.forEach(cat => {
            insertCategory.run(cat.name, cat.description, cat.color, cat.icon);
          });
          insertCategory.finalize();
          console.log('✅ تم إدراج الأقسام الافتراضية');
        } else {
          console.log('✅ الأقسام موجودة بالفعل');
        }
      });

      // Insert sample questions
      const sampleQuestions = [
        {
          category_id: 1,
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
          category_id: 2,
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
          category_id: 3,
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

      // Check if questions already exist
      db.get('SELECT COUNT(*) as count FROM questions', (err, result) => {
        if (err) {
          console.error('❌ خطأ في فحص الأسئلة:', err);
        } else if (result.count === 0) {
          // Only insert if no questions exist
          const insertQuestion = db.prepare(`INSERT INTO questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          sampleQuestions.forEach(q => {
            insertQuestion.run(q.category_id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.difficulty, q.points);
          });
          insertQuestion.finalize();
          console.log('✅ تم إدراج الأسئلة الافتراضية');
        } else {
          console.log('✅ الأسئلة موجودة بالفعل');
        }
      });

      console.log('✅ قاعدة البيانات تم تهيئتها بنجاح');
      resolve();
    });
  });
};

// Initialize database on module load
initDatabase().catch(console.error);

module.exports = db; 