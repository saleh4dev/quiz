import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTrophy, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaTrophy className="logo-icon" />
          <span>MyQuiz</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            الرئيسية
          </Link>
          
          {user ? (
            <>
              <Link to="/categories" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                الأقسام
              </Link>
              <Link to="/leaderboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                لوحة الصدارة
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <FaUser className="nav-icon" />
                الملف الشخصي
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                  لوحة التحكم
                </Link>
              )}
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                تسجيل الدخول
              </Link>
              <Link to="/register" className="nav-link register-link" onClick={() => setIsMenuOpen(false)}>
                التسجيل
              </Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 