import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && target && !target.closest(".navbar")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">
            <span className="logo-tre">Tre</span>spics
          </span>
          <span className="logo-dot">.</span>
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${isOpen ? "hamburger-active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Menu */}
        <div className={`nav-menu ${isOpen ? "nav-menu-active" : ""}`}>
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>
              About
            </Link>
            <Link to="/courses" className="nav-link" onClick={closeMenu}>
              Courses
            </Link>
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </Link>

            <div className="nav-divider"></div>

            {/* AUTH ROUTES — handled inside each app */}
            <div className="nav-buttons">
              <Link
                to="/auth/login"
                className="nav-btn nav-btn-outline"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/auth/register"
                className="nav-btn nav-btn-primary"
                onClick={closeMenu}
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`nav-overlay ${isOpen ? "nav-overlay-active" : ""}`}
          onClick={closeMenu}
        />
      </div>
    </nav>
  );
};

export default Navbar;
