import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".navbar")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">
            <span className="logo-tre">Tre</span>spics
          </span>
          <span className="logo-dot">.</span>
        </Link>

        {/* Hamburger Button */}
        <button
          className={`hamburger ${isOpen ? "hamburger-active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger-line hamburger-line-1"></span>
          <span className="hamburger-line hamburger-line-2"></span>
          <span className="hamburger-line hamburger-line-3"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`nav-menu ${isOpen ? "nav-menu-active" : ""}`}>
          <div className="nav-menu-header">
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <span className="logo-text">
                <span className="logo-tre">Tre</span>spics
              </span>
            </Link>
            <button
              className="close-menu"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <span className="close-line close-line-1"></span>
              <span className="close-line close-line-2"></span>
            </button>
          </div>

          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              <span className="nav-link-icon">🏠</span>
              Home
            </Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>
              <span className="nav-link-icon">📖</span>
              About
            </Link>
            <Link to="/courses" className="nav-link" onClick={closeMenu}>
              <span className="nav-link-icon">📖</span>
              Courses
            </Link>
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              <span className="nav-link-icon">📞</span>
              Contact
            </Link>

            <div className="nav-divider"></div>

            <div className="nav-buttons">
              <Link
                to="/auth/student/login"
                className="nav-btn nav-btn-outline"
                onClick={closeMenu}
              >
                <span className="btn-icon">🔑</span>
                Student Login
              </Link>
              <Link
                to="/auth/student/register"
                className="nav-btn nav-btn-primary"
                onClick={closeMenu}
              >
                <span className="btn-icon">✨</span>
                Student Register
              </Link>
            </div>
          </div>

          <div className="nav-footer">
            <p>Follow us on social media</p>
            <div className="social-links">
              <a href="#" className="social-link">
                📘
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
              <a href="#" className="social-link">
                📷
              </a>
              <a href="#" className="social-link">
                🎥
              </a>
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`nav-overlay ${isOpen ? "nav-overlay-active" : ""}`}
          onClick={closeMenu}
        ></div>
      </div>
    </nav>
  );
};

export default Navbar;
