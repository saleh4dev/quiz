import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaUser, FaTrophy, FaChartLine, FaStar, FaHistory, FaEdit } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [statsResponse, achievementsResponse, activityResponse] = await Promise.all([
        axios.get('/api/users/stats'),
        axios.get('/api/users/achievements'),
        axios.get('/api/quiz/history?limit=5')
      ]);

      setStats(statsResponse.data.stats);
      setAchievements(achievementsResponse.data.achievements);
      setRecentActivity(activityResponse.data.sessions);
    } catch (error) {
      setError('حدث خطأ في تحميل البيانات');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', editForm);
      if (response.data.success) {
        updateUser({ ...user, ...editForm });
        setIsEditing(false);
        alert('تم تحديث الملف الشخصي بنجاح');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ في التحديث');
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const getLevelProgress = () => {
    if (!stats) return 0;
    const currentLevelPoints = (stats.level - 1) * 100;
    const nextLevelPoints = stats.level * 100;
    const progress = ((stats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchUserData} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-card">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label>اسم المستخدم</label>
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="edit-actions">
                  <button type="submit" className="btn-primary">
                    حفظ التغييرات
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1>{user?.username}</h1>
                <p>{user?.email}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  <FaEdit />
                  تعديل الملف الشخصي
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaTrophy />
            </div>
            <div className="stat-content">
              <h3>{stats?.points || 0}</h3>
              <p>النقاط الإجمالية</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>المستوى {stats?.level || 1}</h3>
              <p>المستوى الحالي</p>
              <div className="level-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaHistory />
            </div>
            <div className="stat-content">
              <h3>{stats?.total_quizzes || 0}</h3>
              <p>المسابقات المكتملة</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaStar />
            </div>
            <div className="stat-content">
              <h3>{stats?.accuracy || 0}%</h3>
              <p>نسبة الدقة</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="section">
          <h2>الإنجازات</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">
                  {achievement.icon}
                </div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>النشاط الأخير</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <FaTrophy />
                </div>
                <div className="activity-info">
                  <h4>مسابقة {activity.category_name}</h4>
                  <p>النقاط: {activity.score} | الدقة: {Math.round((activity.correct_answers / activity.total_questions) * 100)}%</p>
                  <span className="activity-date">
                    {new Date(activity.completed_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {stats?.categoryStats && stats.categoryStats.length > 0 && (
          <div className="section">
            <h2>إحصائيات الأقسام</h2>
            <div className="category-stats-grid">
              {stats.categoryStats.map((catStat, index) => (
                <div key={index} className="category-stat-card">
                  <div className="category-stat-header">
                    <h4>{catStat.category_name}</h4>
                    <div 
                      className="category-color"
                      style={{ backgroundColor: catStat.category_color }}
                    ></div>
                  </div>
                  <div className="category-stat-content">
                    <p>المسابقات: {catStat.quizzes_count}</p>
                    <p>أفضل نتيجة: {Math.round(catStat.best_score || 0)}</p>
                    <p>متوسط النقاط: {Math.round(catStat.avg_score || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 