import React from "react";
import { Navbar } from '@elearning/shared';
import { Footer } from '@elearning/shared';
import { Link } from "react-router-dom";
import "@elearning/shared/styles/pages/Contact.css";

const Contact = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="container contact-hero-content">
          <span className="contact-hero-badge">Get in Touch</span>
          <h1 className="contact-hero-title">
            We're Here to <span className="text-gradient">Help</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have questions? We'd love to hear from you. Reach out to us through
            any of our channels
          </p>
        </div>
        <div className="contact-hero-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="quick-contact-section">
        <div className="container">
          <div className="quick-contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Visit Us</h3>
              <p>
                123 Education Lane
                <br />
                Learning City, Nairobi
                <br />
                10101, Kenya
              </p>
              <span className="contact-card-footer">Main Campus</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Call Us</h3>
              <p>
                +254 (0) 20 123 4567
                <br />
                +254 (0) 720 123 456
              </p>
              <span className="contact-card-footer">Mon-Fri, 8am-6pm</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email Us</h3>
              <p>
                info@trespicsschool.com
                <br />
                support@trespicsschool.com
              </p>
              <span className="contact-card-footer">24/7 Support</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p>
                Chat with our support team
                <br />
                for instant assistance
              </p>
              <span className="contact-card-footer">Available 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="contact-methods-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Multiple Ways to Connect</span>
            <h2 className="section-title">
              Choose Your Preferred Contact Method
            </h2>
            <p className="section-subtitle">
              We've made it easy for you to reach us through various channels
            </p>
          </div>

          <div className="methods-grid">
            <div className="method-card">
              <div className="method-icon">
                <span className="method-emoji">📱</span>
              </div>
              <h3>Mobile App</h3>
              <p>
                Download our mobile app for instant messaging and notifications
              </p>
              <div className="app-badges">
                <span className="app-badge">App Store</span>
                <span className="app-badge">Google Play</span>
              </div>
            </div>

            <div className="method-card">
              <div className="method-icon">
                <span className="method-emoji">💼</span>
              </div>
              <h3>Business Hours</h3>
              <div className="hours-list">
                <div className="hour-item">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="hour-item">
                  <span>Saturday</span>
                  <span>9:00 AM - 2:00 PM</span>
                </div>
                <div className="hour-item">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="method-card">
              <div className="method-icon">
                <span className="method-emoji">🌐</span>
              </div>
              <h3>Social Media</h3>
              <p>
                Connect with us on social media for updates and announcements
              </p>
              <div className="social-media-links">
                <a href="#" className="social-link">
                  📘 Facebook
                </a>
                <a href="#" className="social-link">
                  🐦 Twitter
                </a>
                <a href="#" className="social-link">
                  📷 Instagram
                </a>
                <a href="#" className="social-link">
                  🎥 YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="departments-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Department Contacts</span>
            <h2 className="section-title">Reach the Right Team</h2>
            <p className="section-subtitle">
              Contact specific departments for specialized assistance
            </p>
          </div>

          <div className="departments-grid">
            <div className="department-card">
              <div className="department-header">
                <span className="department-icon">🎓</span>
                <h3>Admissions Office</h3>
              </div>
              <div className="department-details">
                <p>
                  <span>📞</span> +254 (0) 20 123 4568
                </p>
                <p>
                  <span>✉️</span> admissions@trespicsschool.com
                </p>
                <p>
                  <span>👤</span> Contact: Sarah Kimani
                </p>
              </div>
            </div>

            <div className="department-card">
              <div className="department-header">
                <span className="department-icon">💻</span>
                <h3>Technical Support</h3>
              </div>
              <div className="department-details">
                <p>
                  <span>📞</span> +254 (0) 20 123 4569
                </p>
                <p>
                  <span>✉️</span> tech@trespicsschool.com
                </p>
                <p>
                  <span>👤</span> Contact: James Omondi
                </p>
              </div>
            </div>

            <div className="department-card">
              <div className="department-header">
                <span className="department-icon">💰</span>
                <h3>Finance Department</h3>
              </div>
              <div className="department-details">
                <p>
                  <span>📞</span> +254 (0) 20 123 4570
                </p>
                <p>
                  <span>✉️</span> finance@trespicsschool.com
                </p>
                <p>
                  <span>👤</span> Contact: Mary Wanjiku
                </p>
              </div>
            </div>

            <div className="department-card">
              <div className="department-header">
                <span className="department-icon">👥</span>
                <h3>Student Support</h3>
              </div>
              <div className="department-details">
                <p>
                  <span>📞</span> +254 (0) 20 123 4571
                </p>
                <p>
                  <span>✉️</span> studentsupport@trespicsschool.com
                </p>
                <p>
                  <span>👤</span> Contact: Peter Njoroge
                </p>
              </div>
            </div>

            <div className="department-card">
              <div className="department-header">
                <span className="department-icon">🌍</span>
                <h3>International Office</h3>
              </div>
              <div className="department-details">
                <p>
                  <span>📞</span> +254 (0) 20 123 4572
                </p>
                <p>
                  <span>✉️</span> international@trespicsschool.com
                </p>
                <p>
                  <span>👤</span> Contact: Dr. Amina Hassan
                </p>
              </div>
            </div>

            <div className="department-card">
              <div className="department-header">
                <span className="department-icon">📢</span>
                <h3>Marketing & PR</h3>
              </div>
              <div className="department-details">
                <p>
                  <span>📞</span> +254 (0) 20 123 4573
                </p>
                <p>
                  <span>✉️</span> marketing@trespicsschool.com
                </p>
                <p>
                  <span>👤</span> Contact: David Ochieng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="faq-preview-section">
        <div className="container">
          <div className="faq-content">
            <h2>Frequently Asked Questions</h2>
            <p>
              Find quick answers to common questions about our school and
              services
            </p>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>How do I enroll my child?</h4>
                <p>
                  Visit our admissions page or contact the admissions office for
                  guidance.
                </p>
              </div>
              <div className="faq-item">
                <h4>What are the tuition fees?</h4>
                <p>
                  Contact our finance department for detailed fee structure and
                  payment plans.
                </p>
              </div>
              <div className="faq-item">
                <h4>Do you offer scholarships?</h4>
                <p>
                  Yes, we have various scholarship programs. Contact us for more
                  information.
                </p>
              </div>
              <div className="faq-item">
                <h4>How can I access the portal?</h4>
                <p>
                  Students receive login credentials upon enrollment. Contact
                  support for help.
                </p>
              </div>
            </div>
            <Link to="/faq" className="btn btn-outline">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Need Immediate Assistance?</h2>
            <p>
              Our support team is available 24/7 to help you with any questions
              or concerns
            </p>
            <div className="cta-buttons">
              <a href="tel:+254201234567" className="btn btn-primary btn-lg">
                <span className="btn-icon">📞</span>
                Call Us Now
              </a>
              <a
                href="mailto:support@trespicsschool.com"
                className="btn btn-outline-light btn-lg"
              >
                <span className="btn-icon">✉️</span>
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
