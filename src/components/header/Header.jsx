import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}

        <Link to="/" className="header-logo">
          <img src={logo} alt="Evangadi Logo" className="logo-image" />
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            How it works
          </Link>

          {isLoggedIn ? (
            <button onClick={handleLogout} className="nav-button logout-btn">
              LOG OUT
            </button>
          ) : (
            <Link to="/login" className="nav-button signin-btn">
              SIGN IN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
