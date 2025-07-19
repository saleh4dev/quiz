import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaQuestionCircle, FaTrophy, FaChartLine, FaCog, FaPlus, FaFolder } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState({ id: '', name: '', description: '' });
  const [editingQuestion, setEditingQuestion] = useState({
    id: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: '',
    category_id: '',
    difficulty: 'medium',
    points: 10
  });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: '',
    category_id: '',
    difficulty: 'medium',
    points: 10
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchCategories();
    fetchQuestions();
    fetchUsers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/all');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', newCategory);
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
      fetchCategories();
      setSuccessMessage('تم إضافة القسم بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding category:', error);
      setSuccessMessage('حدث خطأ في إضافة القسم');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/questions', newQuestion);
      setNewQuestion({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: '',
        category_id: '',
        difficulty: 'medium',
        points: 10
      });
      setShowAddQuestion(false);
      fetchQuestions();
      setSuccessMessage('تم إضافة السؤال بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding question:', error);
      setSuccessMessage('حدث خطأ في إضافة السؤال');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description || ''
    });
    setShowEditCategory(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/categories/${editingCategory.id}`, {
        name: editingCategory.name,
        description: editingCategory.description
      });
      setShowEditCategory(false);
      setEditingCategory({ id: '', name: '', description: '' });
      fetchCategories();
      setSuccessMessage('تم تحديث القسم بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating category:', error);
      setSuccessMessage('حدث خطأ في تحديث القسم');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      try {
        await axios.delete(`/api/categories/${categoryId}`);
        fetchCategories();
        setSuccessMessage('تم حذف القسم بنجاح!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting category:', error);
        setSuccessMessage('حدث خطأ في حذف القسم');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({
      id: question.id,
      question: question.question_text,
      option1: question.option_a,
      option2: question.option_b,
      option3: question.option_c,
      option4: question.option_d,
      correct_answer: question.correct_answer,
      category_id: question.category_id,
      difficulty: question.difficulty,
      points: question.points
    });
    setShowEditQuestion(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/questions/${editingQuestion.id}`, editingQuestion);
      setShowEditQuestion(false);
      setEditingQuestion({
        id: '',
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: '',
        category_id: '',
        difficulty: 'medium',
        points: 10
      });
      fetchQuestions();
      setSuccessMessage('تم تحديث السؤال بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating question:', error);
      setSuccessMessage('حدث خطأ في تحديث السؤال');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        await axios.delete(`/api/questions/${questionId}`);
        fetchQuestions();
        setSuccessMessage('تم حذف السؤال بنجاح!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting question:', error);
        setSuccessMessage('حدث خطأ في حذف السؤال');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data.dashboard);
    } catch (error) {
      setError('حدث خطأ في تحميل لوحة التحكم');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      <div className="admin-container">
        <div className="admin-header">
          <h1>لوحة التحكم الإدارية</h1>
          <p>مرحباً بك في لوحة تحكم MyQuiz</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine />
            نظرة عامة
          </button>
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers />
            المستخدمين
          </button>
          <button 
            className={`admin-tab ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <FaQuestionCircle />
            الأسئلة
          </button>
          <button 
            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FaFolder />
            الأقسام
          </button>
          <button 
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog />
            الإعدادات
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-stats">
                <div className="stat-card users">
                  <div className="stat-number">{Array.isArray(users) ? users.length : 0}</div>
                  <div className="stat-label">إجمالي المستخدمين</div>
                </div>

                <div className="stat-card questions">
                  <div className="stat-number">{Array.isArray(questions) ? questions.length : 0}</div>
                  <div className="stat-label">إجمالي الأسئلة</div>
                </div>

                <div className="stat-card categories">
                  <div className="stat-number">{Array.isArray(categories) ? categories.length : 0}</div>
                  <div className="stat-label">الأقسام</div>
                </div>

                <div className="stat-card sessions">
                  <div className="stat-number">{dashboardData?.totalQuizzes || 0}</div>
                  <div className="stat-label">إجمالي المسابقات</div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>النشاط الأخير</h3>
                {dashboardData?.recentActivity?.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon quiz">
                      <FaTrophy />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">{activity.username} أكمل مسابقة {activity.category_name}</div>
                      <div className="activity-time">
                        النقاط: {activity.score} | {new Date(activity.completed_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="activity-item">
                    <div className="activity-icon quiz">
                      <FaTrophy />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">لا توجد نشاطات حديثة</div>
                      <div className="activity-time">ابدأ المسابقات لرؤية النشاط</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-tab">
              <div className="users-filters">
                <input type="text" placeholder="البحث عن مستخدم..." />
                <select>
                  <option value="">جميع المستويات</option>
                  <option value="1">المستوى 1</option>
                  <option value="2">المستوى 2</option>
                  <option value="3">المستوى 3</option>
                </select>
              </div>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>المستخدم</th>
                      <th>البريد الإلكتروني</th>
                      <th>النقاط</th>
                      <th>المستوى</th>
                      <th>المسابقات</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                      users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                            {user.username}
                          </td>
                          <td>{user.email}</td>
                          <td>{user.points || 0}</td>
                          <td>{user.level || 1}</td>
                          <td>{user.total_quizzes || 0}</td>
                          <td>
                            <div className="user-actions">
                              <button className="btn-edit">تعديل</button>
                              <button className="btn-delete">حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>
                          لا يوجد مستخدمين متاحين
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="questions-tab">
              <div className="tab-header">
                <h3>إدارة الأسئلة</h3>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddQuestion(true)}
                >
                  <FaPlus />
                  إضافة سؤال جديد
                </button>
              </div>
              
              {showAddQuestion && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>إضافة سؤال جديد</h3>
                      <button 
                        className="modal-close"
                        onClick={() => setShowAddQuestion(false)}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleAddQuestion} className="modal-form">
                      <div className="form-group">
                        <label>السؤال</label>
                        <textarea 
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>القسم</label>
                        <select 
                          value={newQuestion.category_id}
                          onChange={(e) => setNewQuestion({...newQuestion, category_id: e.target.value})}
                          required
                        >
                          <option value="">اختر القسم</option>
                          {Array.isArray(categories) && categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>المستوى</label>
                        <select 
                          value={newQuestion.difficulty}
                          onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                        >
                          <option value="easy">سهل</option>
                          <option value="medium">متوسط</option>
                          <option value="hard">صعب</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>النقاط</label>
                        <input 
                          type="number" 
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value)})}
                          min="1"
                          max="20"
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الأول</label>
                        <input 
                          type="text" 
                          value={newQuestion.option1}
                          onChange={(e) => setNewQuestion({...newQuestion, option1: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الثاني</label>
                        <input 
                          type="text" 
                          value={newQuestion.option2}
                          onChange={(e) => setNewQuestion({...newQuestion, option2: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الثالث</label>
                        <input 
                          type="text" 
                          value={newQuestion.option3}
                          onChange={(e) => setNewQuestion({...newQuestion, option3: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الرابع</label>
                        <input 
                          type="text" 
                          value={newQuestion.option4}
                          onChange={(e) => setNewQuestion({...newQuestion, option4: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الإجابة الصحيحة</label>
                        <select 
                          value={newQuestion.correct_answer}
                          onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                          required
                        >
                          <option value="">اختر الإجابة الصحيحة</option>
                          {newQuestion.option1 && <option value={newQuestion.option1}>{newQuestion.option1}</option>}
                          {newQuestion.option2 && <option value={newQuestion.option2}>{newQuestion.option2}</option>}
                          {newQuestion.option3 && <option value={newQuestion.option3}>{newQuestion.option3}</option>}
                          {newQuestion.option4 && <option value={newQuestion.option4}>{newQuestion.option4}</option>}
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn-save">إضافة السؤال</button>
                        <button 
                          type="button" 
                          className="btn-cancel"
                          onClick={() => setShowAddQuestion(false)}
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {showEditQuestion && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>تعديل السؤال</h3>
                      <button 
                        className="modal-close"
                        onClick={() => setShowEditQuestion(false)}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleUpdateQuestion} className="modal-form">
                      <div className="form-group">
                        <label>السؤال</label>
                        <textarea 
                          value={editingQuestion.question}
                          onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>القسم</label>
                        <select 
                          value={editingQuestion.category_id}
                          onChange={(e) => setEditingQuestion({...editingQuestion, category_id: e.target.value})}
                          required
                        >
                          <option value="">اختر القسم</option>
                          {Array.isArray(categories) && categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>المستوى</label>
                        <select 
                          value={editingQuestion.difficulty}
                          onChange={(e) => setEditingQuestion({...editingQuestion, difficulty: e.target.value})}
                        >
                          <option value="easy">سهل</option>
                          <option value="medium">متوسط</option>
                          <option value="hard">صعب</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>النقاط</label>
                        <input 
                          type="number" 
                          value={editingQuestion.points}
                          onChange={(e) => setEditingQuestion({...editingQuestion, points: parseInt(e.target.value)})}
                          min="1"
                          max="20"
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الأول</label>
                        <input 
                          type="text" 
                          value={editingQuestion.option1}
                          onChange={(e) => setEditingQuestion({...editingQuestion, option1: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الثاني</label>
                        <input 
                          type="text" 
                          value={editingQuestion.option2}
                          onChange={(e) => setEditingQuestion({...editingQuestion, option2: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الثالث</label>
                        <input 
                          type="text" 
                          value={editingQuestion.option3}
                          onChange={(e) => setEditingQuestion({...editingQuestion, option3: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الخيار الرابع</label>
                        <input 
                          type="text" 
                          value={editingQuestion.option4}
                          onChange={(e) => setEditingQuestion({...editingQuestion, option4: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>الإجابة الصحيحة</label>
                        <select 
                          value={editingQuestion.correct_answer}
                          onChange={(e) => setEditingQuestion({...editingQuestion, correct_answer: e.target.value})}
                          required
                        >
                          <option value="">اختر الإجابة الصحيحة</option>
                          {editingQuestion.option1 && <option value={editingQuestion.option1}>{editingQuestion.option1}</option>}
                          {editingQuestion.option2 && <option value={editingQuestion.option2}>{editingQuestion.option2}</option>}
                          {editingQuestion.option3 && <option value={editingQuestion.option3}>{editingQuestion.option3}</option>}
                          {editingQuestion.option4 && <option value={editingQuestion.option4}>{editingQuestion.option4}</option>}
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn-save">حفظ التعديلات</button>
                        <button 
                          type="button" 
                          className="btn-cancel"
                          onClick={() => setShowEditQuestion(false)}
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="questions-filters">
                <input type="text" placeholder="البحث في الأسئلة..." />
                <select>
                  <option value="">جميع الأقسام</option>
                  {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select>
                  <option value="">جميع المستويات</option>
                  <option value="easy">سهل</option>
                  <option value="medium">متوسط</option>
                  <option value="hard">صعب</option>
                </select>
              </div>
              <div className="questions-table">
                <table>
                  <thead>
                    <tr>
                      <th>السؤال</th>
                      <th>القسم</th>
                      <th>المستوى</th>
                      <th>النقاط</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(questions) && questions.length > 0 ? (
                      questions.map(question => (
                        <tr key={question.id}>
                          <td className="question-text">{question.question_text}</td>
                          <td>
                            <span className="question-category">
                              {Array.isArray(categories) ? categories.find(cat => cat.id === parseInt(question.category_id))?.name || 'غير محدد' : 'غير محدد'}
                            </span>
                          </td>
                          <td>
                            <span className={`question-difficulty ${question.difficulty}`}>
                              {question.difficulty === 'easy' ? 'سهل' : 
                               question.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                            </span>
                          </td>
                          <td>{question.points}</td>
                          <td>
                            <div className="user-actions">
                              <button className="btn-edit">تعديل</button>
                              <button className="btn-delete">حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>
                          لا توجد أسئلة متاحة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="categories-tab">
              <div className="tab-header">
                <h3>إدارة الأقسام</h3>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddCategory(true)}
                >
                  <FaPlus />
                  إضافة قسم جديد
                </button>
              </div>

              {showAddCategory && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>إضافة قسم جديد</h3>
                      <button 
                        className="modal-close"
                        onClick={() => setShowAddCategory(false)}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleAddCategory} className="modal-form">
                      <div className="form-group">
                        <label>اسم القسم</label>
                        <input 
                          type="text" 
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>وصف القسم</label>
                        <textarea 
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        />
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn-save">إضافة القسم</button>
                        <button 
                          type="button" 
                          className="btn-cancel"
                          onClick={() => setShowAddCategory(false)}
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {showEditCategory && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>تعديل القسم</h3>
                      <button 
                        className="modal-close"
                        onClick={() => setShowEditCategory(false)}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleUpdateCategory} className="modal-form">
                      <div className="form-group">
                        <label>اسم القسم</label>
                        <input 
                          type="text" 
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>وصف القسم</label>
                        <textarea 
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                        />
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn-save">حفظ التعديلات</button>
                        <button 
                          type="button" 
                          className="btn-cancel"
                          onClick={() => setShowEditCategory(false)}
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="categories-grid">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(category => (
                    <div key={category.id} className="category-card">
                      <div className="category-icon">
                        <FaFolder />
                      </div>
                      <div className="category-content">
                        <h4>{category.name}</h4>
                        <p>{category.description || 'لا يوجد وصف'}</p>
                        <div className="category-stats">
                          <span>{Array.isArray(questions) ? questions.filter(q => q.category_id === parseInt(category.id)).length : 0} سؤال</span>
                        </div>
                      </div>
                                          <div className="category-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditCategory(category)}
                      >
                        تعديل
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        حذف
                      </button>
                    </div>
                    </div>
                  ))
                ) : (
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '50px'}}>
                    لا توجد أقسام متاحة
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-section">
                <h3>إعدادات عامة</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>اسم الموقع</label>
                    <input type="text" defaultValue="MyQuiz" />
                  </div>
                  <div className="form-group">
                    <label>وصف الموقع</label>
                    <textarea defaultValue="منصة المسابقات الثقافية التفاعلية"></textarea>
                  </div>
                  <div className="form-group">
                    <label>عدد الأسئلة في المسابقة</label>
                    <input type="number" defaultValue="10" />
                  </div>
                  <button className="btn-save">حفظ الإعدادات</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 