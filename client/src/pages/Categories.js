import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaQuestionCircle, FaUsers } from 'react-icons/fa';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/stats/all');
      setCategories(response.data.categories);
    } catch (error) {
      setError('حدث خطأ في تحميل الأقسام');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الأقسام...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchCategories} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>اختر القسم</h1>
        <p>اختر المجال المعرفي الذي تريد التنافس فيه</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div 
              className="category-header"
              style={{ backgroundColor: category.color }}
            >
              <div className="category-icon">
                {getCategoryIcon(category.icon)}
              </div>
              <h3>{category.name}</h3>
            </div>
            
            <div className="category-content">
              <p className="category-description">
                {category.description || `أسئلة في مجال ${category.name}`}
              </p>
              
              <div className="category-stats">
                <div className="stat">
                  <FaQuestionCircle />
                  <span>{category.question_count || 0} سؤال</span>
                </div>
                <div className="stat">
                  <FaUsers />
                  <span>متاح للجميع</span>
                </div>
              </div>

              <Link 
                to={`/quiz/${category.id}`}
                className="start-quiz-button"
                style={{ backgroundColor: category.color }}
              >
                <FaPlay />
                ابدأ المسابقة
              </Link>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <FaQuestionCircle className="empty-icon" />
          <h3>لا توجد أقسام متاحة</h3>
          <p>يرجى المحاولة لاحقاً</p>
        </div>
      )}
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (iconName) => {
  const iconMap = {
    'landmark': '🏛️',
    'flask': '🔬',
    'book-open': '📚',
    'calculator': '🧮',
    'globe': '🌍',
    'futbol': '⚽',
    'book': '📖'
  };
  
  return iconMap[iconName] || '📚';
};

export default Categories; 