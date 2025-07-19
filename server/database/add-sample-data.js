const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'quiz.db');
const db = new sqlite3.Database(dbPath);

const addSampleData = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('📝 إضافة بيانات إضافية للعينة...');
      
      // Get category IDs
      db.all('SELECT id, name FROM categories', (err, categories) => {
        if (err) {
          console.error('❌ خطأ في جلب الأقسام:', err);
          reject(err);
          return;
        }
        
        const categoryMap = {};
        categories.forEach(cat => {
          categoryMap[cat.name] = cat.id;
        });
        
        // Sample questions for each category
        const sampleQuestions = [
          // التاريخ - History
          {
            category_name: 'التاريخ',
            question_text: 'من هو أول خليفة في الدولة العباسية؟',
            option_a: 'أبو العباس السفاح',
            option_b: 'أبو جعفر المنصور',
            option_c: 'هارون الرشيد',
            option_d: 'المأمون',
            correct_answer: 'أبو العباس السفاح',
            difficulty: 'medium',
            points: 10
          },
          {
            category_name: 'التاريخ',
            question_text: 'في أي عام سقطت بغداد على يد المغول؟',
            option_a: '1258 م',
            option_b: '1200 م',
            option_c: '1300 م',
            option_d: '1400 م',
            correct_answer: '1258 م',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'التاريخ',
            question_text: 'من هو مؤسس الدولة الأموية؟',
            option_a: 'معاوية بن أبي سفيان',
            option_b: 'عبد الملك بن مروان',
            option_c: 'الوليد بن عبد الملك',
            option_d: 'هشام بن عبد الملك',
            correct_answer: 'معاوية بن أبي سفيان',
            difficulty: 'medium',
            points: 10
          },
          
          // العلوم - Science
          {
            category_name: 'العلوم',
            question_text: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
            option_a: 'الأرض',
            option_b: 'المشتري',
            option_c: 'زحل',
            option_d: 'نبتون',
            correct_answer: 'المشتري',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'العلوم',
            question_text: 'ما هو العنصر الكيميائي الذي يحمل الرمز Fe؟',
            option_a: 'الفلور',
            option_b: 'الحديد',
            option_c: 'الفوسفور',
            option_d: 'الفرانسيوم',
            correct_answer: 'الحديد',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'العلوم',
            question_text: 'ما هو عدد العظام في جسم الإنسان البالغ؟',
            option_a: '206',
            option_b: '186',
            option_c: '226',
            option_d: '196',
            correct_answer: '206',
            difficulty: 'medium',
            points: 10
          },
          
          // الأدب - Literature
          {
            category_name: 'الأدب',
            question_text: 'من هو مؤلف كتاب "كليلة ودمنة"؟',
            option_a: 'ابن المقفع',
            option_b: 'الجاحظ',
            option_c: 'ابن خلدون',
            option_d: 'ابن بطوطة',
            correct_answer: 'ابن المقفع',
            difficulty: 'medium',
            points: 10
          },
          {
            category_name: 'الأدب',
            question_text: 'من هو شاعر النيل؟',
            option_a: 'أحمد شوقي',
            option_b: 'حافظ إبراهيم',
            option_c: 'محمود سامي البارودي',
            option_d: 'أحمد رامي',
            correct_answer: 'حافظ إبراهيم',
            difficulty: 'medium',
            points: 10
          },
          {
            category_name: 'الأدب',
            question_text: 'من هو مؤلف "المتنبي"؟',
            option_a: 'أبو الطيب المتنبي',
            option_b: 'أبو العلاء المعري',
            option_c: 'أبو تمام',
            option_d: 'البحتري',
            correct_answer: 'أبو الطيب المتنبي',
            difficulty: 'hard',
            points: 12
          },
          
          // الرياضيات - Mathematics
          {
            category_name: 'الرياضيات',
            question_text: 'ما هو ناتج 15 × 15؟',
            option_a: '200',
            option_b: '225',
            option_c: '250',
            option_d: '275',
            correct_answer: '225',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'الرياضيات',
            question_text: 'ما هو الجذر التربيعي للعدد 144؟',
            option_a: '10',
            option_b: '11',
            option_c: '12',
            option_d: '13',
            correct_answer: '12',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'الرياضيات',
            question_text: 'ما هو مجموع زوايا المثلث؟',
            option_a: '90 درجة',
            option_b: '180 درجة',
            option_c: '270 درجة',
            option_d: '360 درجة',
            correct_answer: '180 درجة',
            difficulty: 'medium',
            points: 10
          },
          
          // الجغرافيا - Geography
          {
            category_name: 'الجغرافيا',
            question_text: 'ما هي أكبر قارة في العالم؟',
            option_a: 'أفريقيا',
            option_b: 'آسيا',
            option_c: 'أمريكا الشمالية',
            option_d: 'أوروبا',
            correct_answer: 'آسيا',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'الجغرافيا',
            question_text: 'ما هو أطول نهر في العالم؟',
            option_a: 'النيل',
            option_b: 'الأمازون',
            option_c: 'المسيسيبي',
            option_d: 'اليانغتسي',
            correct_answer: 'النيل',
            difficulty: 'medium',
            points: 10
          },
          {
            category_name: 'الجغرافيا',
            question_text: 'ما هي عاصمة اليابان؟',
            option_a: 'طوكيو',
            option_b: 'أوساكا',
            option_c: 'كيوتو',
            option_d: 'يوكوهاما',
            correct_answer: 'طوكيو',
            difficulty: 'easy',
            points: 8
          },
          
          // الرياضة - Sports
          {
            category_name: 'الرياضة',
            question_text: 'في أي عام أقيمت أول بطولة كأس عالم لكرة القدم؟',
            option_a: '1930',
            option_b: '1934',
            option_c: '1938',
            option_d: '1950',
            correct_answer: '1930',
            difficulty: 'medium',
            points: 10
          },
          {
            category_name: 'الرياضة',
            question_text: 'ما هو عدد اللاعبين في فريق كرة القدم؟',
            option_a: '10',
            option_b: '11',
            option_c: '12',
            option_d: '13',
            correct_answer: '11',
            difficulty: 'easy',
            points: 8
          },
          {
            category_name: 'الرياضة',
            question_text: 'من هو اللاعب الذي فاز بجائزة الكرة الذهبية 7 مرات؟',
            option_a: 'كريستيانو رونالدو',
            option_b: 'ليونيل ميسي',
            option_c: 'بيليه',
            option_d: 'مارادونا',
            correct_answer: 'ليونيل ميسي',
            difficulty: 'medium',
            points: 10
          }
        ];

        const insertQuestion = db.prepare(`INSERT OR IGNORE INTO questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        
        let insertedCount = 0;
        sampleQuestions.forEach(q => {
          const categoryId = categoryMap[q.category_name];
          if (categoryId) {
            insertQuestion.run(categoryId, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.difficulty, q.points, function(err) {
              if (!err && this.changes > 0) {
                insertedCount++;
              }
            });
          }
        });
        
        insertQuestion.finalize(() => {
          console.log(`✅ تم إضافة ${insertedCount} سؤال جديد`);
          console.log('🎉 تم إضافة البيانات الإضافية بنجاح!');
          resolve();
        });
      });
    });
  });
};

// Run if this file is executed directly
if (require.main === module) {
  addSampleData()
    .then(() => {
      console.log('✅ تم الانتهاء من إضافة البيانات الإضافية');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ خطأ في إضافة البيانات الإضافية:', err);
      process.exit(1);
    });
}

module.exports = { addSampleData }; 