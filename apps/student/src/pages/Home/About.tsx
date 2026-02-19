import React from "react";
import { Navbar } from '@elearning/shared';
import { Footer } from '@elearning/shared';
import { Link } from "react-router-dom";
import "@elearning/shared/styles/pages/About.css";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <span className="about-hero-badge">About Us</span>
          <h1 className="about-hero-title">
            Shaping Tomorrow's <span className="text-gradient">Leaders</span>
          </h1>
          <p className="about-hero-subtitle">
            Discover the story behind Trespics School and our commitment to
            excellence in education
          </p>
        </div>
        <div className="about-hero-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-number" data-target="10000">
                10K+
              </div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-number" data-target="500">
                500+
              </div>
              <div className="stat-label">Expert Teachers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-number" data-target="1000">
                1000+
              </div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-number" data-target="50">
                50+
              </div>
              <div className="stat-label">Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card animate-slide-left">
              <div className="card-icon">
                <span className="icon">🎯</span>
              </div>
              <h2>Our Mission</h2>
              <p>
                To empower students with knowledge and skills for the future
                through innovative technology and expert guidance. We believe in
                creating an inclusive learning environment where every student
                can thrive and reach their full potential.
              </p>
              <ul className="mission-list">
                <li>✓ Quality education for all</li>
                <li>✓ Innovation in teaching</li>
                <li>✓ Student-centered approach</li>
              </ul>
            </div>

            <div className="vision-card animate-slide-right">
              <div className="card-icon">
                <span className="icon">👁️</span>
              </div>
              <h2>Our Vision</h2>
              <p>
                To be a global leader in digital education, breaking down
                barriers and creating opportunities for lifelong learning. We
                envision a world where quality education is accessible to
                everyone, everywhere.
              </p>
              <ul className="vision-list">
                <li>✓ Global accessibility</li>
                <li>✓ Lifelong learning</li>
                <li>✓ Educational excellence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content animate-fade-in">
              <span className="section-badge">Our Journey</span>
              <h2 className="section-title">The Trespics Story</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-year">2020</div>
                  <div className="timeline-content">
                    <h3>The Beginning</h3>
                    <p>
                      Founded with a simple mission: to make quality education
                      accessible to everyone, everywhere. Started as a small
                      local initiative with just 50 students and 5 teachers.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-year">2022</div>
                  <div className="timeline-content">
                    <h3>Rapid Growth</h3>
                    <p>
                      Expanded to serve 5000+ students across the country.
                      Launched interactive live classes and recorded video
                      lessons.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-year">2024</div>
                  <div className="timeline-content">
                    <h3>Global Recognition</h3>
                    <p>
                      Now serving 10,000+ students globally with 500+ expert
                      teachers. Recognized as one of the top e-learning
                      platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-image animate-fade-in delay-1">
              <img src="/api/placeholder/600/800" alt="Our Journey" />
              <div className="experience-badge">
                <span className="years">4+</span>
                <span className="text">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Core Values</span>
            <h2 className="section-title">What Drives Us Forward</h2>
            <p className="section-subtitle">
              These principles guide everything we do at Trespics School
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🔬</div>
              <h3>Innovation</h3>
              <p>
                Constantly evolving our teaching methods and technology to
                provide the best learning experience.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Integrity</h3>
              <p>
                Maintaining honesty and transparency in all our interactions
                with students and parents.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Excellence</h3>
              <p>
                Striving for the highest standards in education and student
                support services.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Inclusivity</h3>
              <p>
                Creating a welcoming environment for students from all
                backgrounds and abilities.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Creativity</h3>
              <p>
                Encouraging creative thinking and problem-solving skills in our
                students.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Compassion</h3>
              <p>
                Supporting each student's unique journey with care and
                understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Leadership Team</span>
            <h2 className="section-title">Meet Our Founders</h2>
            <p className="section-subtitle">
              Passionate educators dedicated to transforming education
            </p>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <img src="/api/placeholder/400/400" alt="Dr. Sarah Johnson" />
                <div className="team-social">
                  <a href="#" className="social-icon">
                    📧
                  </a>
                  <a href="#" className="social-icon">
                    💼
                  </a>
                  <a href="#" className="social-icon">
                    🐦
                  </a>
                </div>
              </div>
              <div className="team-info">
                <h3>Dr. Sarah Johnson</h3>
                <p className="team-position">Founder & CEO</p>
                <p className="team-bio">
                  20+ years in education technology, PhD in Educational
                  Psychology
                </p>
              </div>
            </div>

            <div className="team-card">
              <div className="team-image">
                <img src="/api/placeholder/400/400" alt="Prof. Michael Chen" />
                <div className="team-social">
                  <a href="#" className="social-icon">
                    📧
                  </a>
                  <a href="#" className="social-icon">
                    💼
                  </a>
                  <a href="#" className="social-icon">
                    🐦
                  </a>
                </div>
              </div>
              <div className="team-info">
                <h3>Prof. Michael Chen</h3>
                <p className="team-position">Academic Director</p>
                <p className="team-bio">
                  Former Dean of Education, curriculum development expert
                </p>
              </div>
            </div>

            <div className="team-card">
              <div className="team-image">
                <img src="/api/placeholder/400/400" alt="Emily Rodriguez" />
                <div className="team-social">
                  <a href="#" className="social-icon">
                    📧
                  </a>
                  <a href="#" className="social-icon">
                    💼
                  </a>
                  <a href="#" className="social-icon">
                    🐦
                  </a>
                </div>
              </div>
              <div className="team-info">
                <h3>Emily Rodriguez</h3>
                <p className="team-position">Head of Technology</p>
                <p className="team-bio">
                  Innovative ed-tech specialist, former Google engineer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of students who are already learning with Trespics
              School
            </p>
            <div className="cta-buttons">
              <Link
                to="/auth/student/register"
                className="btn btn-primary btn-lg"
              >
                Get Started Now
                <span className="btn-icon">→</span>
              </Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
