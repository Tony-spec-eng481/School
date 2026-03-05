import { useState, useEffect } from "react";
import { Navbar, Footer, StructuredData } from '@elearning/shared';
import { CourseCard } from '@elearning/shared';
import { Link } from "react-router-dom";  
import { axiosInstance as api } from '@elearning/shared';
import "@elearning/shared/styles/pages/Homepage.css";

const schoolSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Trespics Institute",
  url: "https://www.trespicsinstitute.dev",
  logo: "https://storage.googleapis.com/learn-multimedia/logo.jpeg",
  description:
    "Unlock your potential with Trespics Institute. Experience world-class education with our interactive e-learning platform.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kirinyaga",
    addressRegion: "Kirinyaga County",
    postalCode: "10304",
    addressCountry: "KE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254770428297",
    contactType: "customer service",
  },
  sameAs: ["https://www.facebook.com/", "https://www.youtube.com/"],
};

const Home = () => {   
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data.slice(0, 3)); // Only show top 3 on home
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {  
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);
  return (
    <>
      <StructuredData data={schoolSchema} />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          {/* <div className="hero-badge animate-fade-in">
            Welcome to the Future of Learning
          </div> */}
          <div>
            <h1 className="hero-title animate-slide-up">
              Unlock Your Potential with{" "}
              <span className="text-gradient">Trespics Institute</span>
            </h1>

            <p className="hero-subtitle animate-slide-up delay-1">
              Experience world-class education with our interactive e-learning
              platform. Join students across the world learning from the best
              teachers and achieving their academic goals.
            </p>
            <Link to="/auth/register" className="btn btn-primary btn-lg">
              Start Learning Today
              <span className="btn-icon">→</span>
            </Link>
          </div>

          {/* <div className="hero-buttons animate-slide-up delay-2">
            <Link to="/auth/register" className="btn btn-primary btn-lg">
              Start Learning Today
              <span className="btn-icon">→</span>
            </Link>
          </div> */}
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              We provide the tools and support you need to excel in your
              academic journey
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon bg-blue">
                <span className="icon">📚</span>
              </div>
              <h3>Comprehensive Curriculum</h3>
              <p>
                Access a wide range of courses tailored to your grade and
                syllabus, with regular updates.
              </p>
              <Link to="/dashboard/courses" className="feature-link">
                Explore Courses <span>→</span>
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-green">
                <span className="icon">🎥</span>
              </div>
              <h3>Live Classes & Videos</h3>
              <p>
                Interactive live sessions and high-quality recorded video
                lessons available 24/7.
              </p>
              <Link to="/live-classes/room" className="feature-link">
                Join Live Class <span>→</span>
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-orange">
                <span className="icon">📊</span>
              </div>
              <h3>Progress Tracking</h3>
              <p>
                Monitor your performance with detailed analytics and
                personalized study recommendations.
              </p>
              <Link to="/dashboard/progress" className="feature-link">
                Track Progress <span>→</span>
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-pink">
                <span className="icon">💬</span>
              </div>
              <h3>24/7 Support</h3>
              <p>
                Get help anytime with our dedicated support team and peer
                discussion forums.
              </p>
              <Link to="/contact" className="feature-link">
                Get Support <span>→</span>
              </Link>
            </div>

            {/* <div className="feature-card">
              <div className="feature-icon bg-teal">
                <span className="icon">📱</span>
              </div>
              <h3>Mobile Learning</h3>
              <p>
                Learn on the go with our fully responsive platform and mobile
                app.
              </p>
              <Link to="/mobile-app" className="feature-link">
                Download App <span>→</span>
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">
              Hear from students who transformed their learning experience with
              us
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "Trespics School has completely changed how I approach learning.
                The interactive lessons and supportive teachers have helped me
                improve my grades significantly."
              </p>
              <div className="testimonial-author">
                <img
                  src="/api/placeholder/60/60"
                  alt="Student"
                  className="author-avatar"
                  loading="lazy"
                />
                <div>
                  <h4>Tony James</h4>
                  <p>Mobile Development Student</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "The live classes are amazing! I can ask questions in real-time
                and the recorded sessions are perfect for revision. Best
                decision I made for my education."
              </p>
              <div className="testimonial-author">
                <img
                  src="/api/placeholder/60/60"
                  alt="Student"
                  className="author-avatar"
                />
                <div>
                  <h4>Abigael Wairimu</h4>
                  <p>Cloud Security Student</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "As a parent, I'm impressed with the progress tracking and
                regular updates. My daughter has become more confident and
                engaged in her studies."
              </p>
              <div className="testimonial-author">
                <img
                  src="/api/placeholder/60/60"
                  alt="Parent"
                  className="author-avatar"
                />
                <div>
                  <h4>Lisa Maryanne</h4>
                  <p>Parent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Learning Journey?</h2>
            <p className="cta-text">
              Join Trespics School today and get access to hundreds of courses,
              live classes, and expert teachers.
            </p>
            <div className="cta-buttons">
              <Link to="/auth/register" className="btn btn-primary btn-lg">
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

export default Home;
