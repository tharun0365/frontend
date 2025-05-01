import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming you have an AuthContext
import '../App.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top">
      <div className="container">
        {/* Navbar Brand */}
        <Link className="navbar-brand pink-text" to="/">LMS</Link>

        {/* Toggle button for mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Center Links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link pink-text" to="/Dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link pink-text" to="/books">Books</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link pink-text" to="/borrow-return">Borrow & Return</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link pink-text" to="/your-books">Your Books</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link pink-text" to="/borrow-history">Borrow History</Link>
            </li>
          </ul>

          {/* Right Side Buttons */}
          <div className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn navbar-button me-2">Login</Link>
                <Link to="/register" className="btn navbar-button">Register</Link>
              </>
            ) : (
              <>
                <span className="navbar-text text-white me-3">
                  Welcome, {user.username} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn navbar-button">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
