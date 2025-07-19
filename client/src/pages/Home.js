import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTrophy, FaUsers, FaQuestionCircle, FaStar, FaRocket, FaBrain } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FaQuestionCircle />,
      title: 'أسئلة متنوعة',
      description: 'أسئلة في مختلف المجالات المعرفية مع مستويات صعوبة مختلفة'
    },
    {
      icon: <FaTrophy />,
      title: 'نظام نقاط',
      description: 'اكسب نقاطاً وتقدم في المستويات مع كل إجابة صحيحة'
    },
    {
      icon: <FaUsers />,
      title: 'منافسة جماعية',
      description: 'تنافس مع اللاعبين الآخرين في لوحة الصدارة'
    },
    {
      icon: <FaStar />,
      title: 'إنجازات',
      description: 'احصل على شارات وإنجازات مع تقدمك في اللعب'
    },
    {
      icon: <FaRocket />,
      title: 'سرعة الاستجابة',
      description: 'مؤقت زمني لقياس سرعة إجاباتك'
    },
    {
      icon: <FaBrain />,
      title: 'تعلم تفاعلي',
      description: 'تعلم بطريقة ممتعة وتفاعلية'
    }
  ];

  const categories = [
    { name: 'التاريخ', color: '#dc3545', icon: '🏛️' },
    { name: 'العلوم', color: '#28a745', icon: '🔬' },
    { name: 'الأدب', color: '#ffc107', icon: '📚' },
    { name: 'الرياضيات', color: '#17a2b8', icon: '🧮' },
    { name: 'الجغرافيا', color: '#6f42c1', icon: '🌍' },
    { name: 'الرياضة', color: '#fd7e14', icon: '⚽' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            مرحباً بك في <span className="highlight">MyQuiz</span>
          </h1>
          <p className="hero-subtitle">
            منصة المسابقات الثقافية التفاعلية - اختبر معرفتك وتنافس مع الآخرين
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/categories" className="btn btn-primary">
                ابدأ المسابقة
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  ابدأ الآن
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <FaTrophy className="trophy-icon" />
            <h3>انضم للمنافسة</h3>
            <p>اكسب النقاط وارتقِ في المستويات</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">مميزات المنصة</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">الأقسام المتاحة</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card" style={{ borderColor: category.color }}>
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">6+</div>
              <div className="stat-label">أقسام معرفية</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">سؤال متنوع</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">متاح دائماً</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">مجاني</div>
              <div className="stat-label">للجميع</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>جاهز للبدء؟</h2>
          <p>انضم إلينا الآن وابدأ رحلة التعلم والمنافسة</p>
          {user ? (
            <Link to="/categories" className="btn btn-primary btn-large">
              ابدأ المسابقة الآن
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-large">
              سجل الآن مجاناً
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 