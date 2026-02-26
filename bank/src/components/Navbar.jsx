import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('bankUser'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">SYMB</span>
          {/* <span className="navbar-tagline">Online Bank</span> */}
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link 
                to="/" 
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="navbar-item">
                  <Link 
                    to="/user" 
                    className={`navbar-link ${isActive('/user') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="navbar-item navbar-user-info">
                  <span className="navbar-user-name">{user.holderName}</span>
                </li>
                <li className="navbar-item">
                  <button 
                    className="navbar-btn navbar-btn-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="navbar-item">
                  <Link 
                    to="/login" 
                    className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link 
                    to="/register" 
                    className="navbar-btn navbar-btn-register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;