import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrophy, FaMedal, FaCrown, FaStar } from 'react-icons/fa';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [categoriesResponse] = await Promise.all([
        axios.get('/api/categories')
      ]);
      setCategories(categoriesResponse.data.categories);
    } catch (error) {
      setError('حدث خطأ في تحميل البيانات');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/quiz/leaderboard'
        : `/api/quiz/leaderboard/${selectedCategory}`;
      
      const response = await axios.get(url);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      setError('حدث خطأ في تحميل لوحة الصدارة');
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="rank-icon gold" />;
    if (rank === 2) return <FaMedal className="rank-icon silver" />;
    if (rank === 3) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">{rank}</span>;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل لوحة الصدارة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>لوحة الصدارة</h1>
        <p>أفضل اللاعبين في المنصة</p>
      </div>

      <div className="leaderboard-controls">
        <div className="category-filter">
          <label htmlFor="category-select">اختر القسم:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">جميع الأقسام</option>
            {categories && categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="leaderboard-content">
        {leaderboard.length > 0 ? (
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="header-rank">المرتبة</div>
              <div className="header-player">اللاعب</div>
              <div className="header-points">النقاط</div>
              <div className="header-level">المستوى</div>
              <div className="header-quizzes">المسابقات</div>
              {selectedCategory !== 'all' && (
                <div className="header-avg-score">متوسط النقاط</div>
              )}
            </div>

            {leaderboard.map((player, index) => (
              <div key={index} className={`table-row ${getRankClass(index + 1)}`}>
                <div className="rank-cell">
                  {getRankIcon(index + 1)}
                </div>
                <div className="player-cell">
                  <div className="player-info">
                    <span className="player-name">{player.username}</span>
                    {index < 3 && (
                      <FaStar className="star-icon" />
                    )}
                  </div>
                </div>
                <div className="points-cell">
                  <span className="points-value">{player.points}</span>
                  <span className="points-label">نقطة</span>
                </div>
                <div className="level-cell">
                  <span className="level-badge">المستوى {player.level}</span>
                </div>
                <div className="quizzes-cell">
                  {player.total_quizzes || player.category_quizzes || 0} مسابقة
                </div>
                {selectedCategory !== 'all' && (
                  <div className="avg-score-cell">
                    {player.avg_score ? Math.round(player.avg_score) : 0} نقطة
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaTrophy className="empty-icon" />
            <h3>لا توجد بيانات متاحة</h3>
            <p>كن أول من يشارك في المسابقات!</p>
            <Link to="/categories" className="start-playing-btn">
              ابدأ اللعب الآن
            </Link>
          </div>
        )}
      </div>

      <div className="leaderboard-footer">
        <div className="stats-summary">
          <div className="stat-item">
            <FaTrophy />
            <span>أفضل {leaderboard.length} لاعب</span>
          </div>
          <div className="stat-item">
            <FaStar />
            <span>منافسة مستمرة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 