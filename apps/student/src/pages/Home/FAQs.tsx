import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@elearning/shared";
import { Footer } from "@elearning/shared";
import "./faqs.css";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQs: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  const categories = [
    { id: "all", name: "All Questions", icon: "📋" },
    { id: "admissions", name: "Admissions", icon: "🎓" },
    { id: "academics", name: "Academics", icon: "📚" },
    { id: "technical", name: "Technical Support", icon: "💻" },
    { id: "billing", name: "Billing & Fees", icon: "💰" },
    { id: "student-life", name: "Student Life", icon: "🌟" },
  ];

  const faqData: FAQItem[] = [
    // Admissions Category
    {
      id: 1,
      question: "How do I enroll in your e-learning school?",
      answer:
        "Enrolling in our e-learning school is easy! Simply visit our Register Page, click on 'Enroll Now', and complete the online application form. You'll need to provide basic information(Your Full Name, email address,password), and pay the application fee. You will also be required to choose a course to begin with.",
      category: "admissions",
    },
    {
      id: 2,
      question: "What are the age requirements for enrollment?",
      answer:
        "Our university-level e-learning program admits students aged 15 years and above. Applicants must meet the minimum age requirement at the time of registration. Enrollment is open throughout the year, allowing students to apply and begin their studies at any time. For specific program eligibility or admission guidance, please contact our admissions office.",
      category: "admissions",
    },
    {
      id: 3,
      question: "Do you accept international students?",
      answer:
        "Yes, we welcome students from around the world! Our e-learning platform is designed to accommodate different time zones and cultural backgrounds. We recommend contacting our international admissions coordinator for guidance on the specific requirements for your country.",
      category: "admissions",
    },

    // Academics Category
    {
      id: 4,
      question: "What curriculum do you follow?",
      answer:
        "We follow an accredited American curriculum based on Common Core State Standards, enhanced with international best practices. Our courses are designed by experienced educators and subject matter experts to ensure academic rigor while maintaining engagement through interactive multimedia content, virtual labs, and real-world projects.",
      category: "academics",
    },
    {
      id: 5,
      question: "Are your teachers qualified?",
      answer:
        "Absolutely! All our teachers are state-certified with minimum 5 years of classroom experience. They hold advanced degrees in their subject areas and receive specialized training in online teaching methodologies. Many of our educators have Master's or Doctoral degrees, and all undergo continuous professional development to stay current with educational best practices.",
      category: "academics",
    },
    {
      id: 6,
      question: "How are classes conducted?",
      answer:
        "Classes are conducted through our interactive learning platform. Each day includes a mix of: Live virtual sessions with teachers (recorded for later viewing), Self-paced assignments and projects, Interactive quizzes and assessments, Collaborative group activities, and One-on-one tutoring sessions. Students can access all materials 24/7 from any device.",
      category: "academics",
    },
    {
      id: 7,
      question: "Is your program accredited?",
      answer:
        "Yes, we are fully accredited by AdvancED and the National Association of Private Schools. Our credits are transferable to most public and private schools, and our high school diploma is recognized by colleges and universities nationwide. We maintain strict adherence to educational standards through regular internal and external reviews.",
      category: "academics",
    },

    // Technical Support Category
    {
      id: 8,
      question: "What technology do I need to participate?",
      answer:
        "Students need: A reliable computer (Windows/Mac/Chromebook) with at least 4GB RAM, High-speed internet connection (minimum 10 Mbps), Webcam and microphone for live sessions, Headphones for focused learning, and a modern web browser (Chrome recommended). Tablets can be used for supplementary work but aren't ideal for all activities. We provide a technology checklist upon enrollment.",
      category: "technical",
    },
    {
      id: 9,
      question: "How do I access the student portal?",
      answer:
        "Visit our homepage and click on 'Login' at the top right corner. Enter your registered admission number and password to log in. Once logged in, you'll have access to your dashboard where you can view courses, assignments, grades, and communicate with teachers. If you have trouble logging in, use the 'Forgot Password' link or contact our support team for assistance.",
      category: "technical",
    },
    {
      id: 10,
      question: "What if we experience technical issues during a live class?",
      answer:
        "We have multiple solutions for technical difficulties: First, try refreshing your browser or restarting the app. If issues persist, students can: Join the class audio-only mode, Access the recorded session later, Contact our 24/7 tech support hotline at +254 770 428297, or Chat with live support through the portal. Teachers also provide alternative assignments if technical issues prevent participation.",
      category: "technical",
    },
    {
      id: 11,
      question: "Do you provide technical training for parents?",
      answer:
        "Yes! We offer monthly 'Parent Tech Orientation' webinars to help families navigate our platform. We also provide: Video tutorials on our YouTube channel, A comprehensive parent tech guide (PDF), 24/7 access to our knowledge base, and One-on-one tech coaching sessions by appointment. Check our events calendar for the next orientation session.",
      category: "technical",
    },

    // Billing & Fees Category
    {
      id: 12,
      question: "What are your tuition fees?",
      answer:
        "Our tuition fees are competitive and transparent: $500 per semester for full-time enrollment (4-5 courses), $150 per course for part-time enrollment, Technology fee of $150 per year, Application fee of $50 (one-time), and Optional fees for advanced courses or materials. We also offer flexible payment plans and financial aid options to make education accessible for all families.",
      category: "billing",
    },
    // {
    //   id: 13,
    //   question: "Do you offer scholarships or financial aid?",
    //   answer:
    //     "Yes, we believe every student deserves quality education. We offer: Merit-based scholarships for outstanding students (up to 50% tuition), Need-based financial aid (submit application with tax documents), Sibling discounts (15% off for second child, 20% for third), Military family discounts (10% off), and Early bird registration discounts. Contact our financial aid office for application deadlines and requirements.",
    //   category: "billing",
    // },
    {
      id: 14,
      question: "What is your refund policy?",
      answer:
        "We offer a prorated refund policy: 100% refund within first 2 weeks of the semester, 75% refund within first month, 50% refund within first 6 weeks, No refund after 8 weeks of the semester. Technology fees and application fees are non-refundable. Refunds are processed within 10-15 business days of approval. Contact our billing department to initiate the refund process.",
      category: "billing",
    },
    // {
    //   id: 15,
    //   question: "Are there any additional costs beyond tuition?",
    //   answer:
    //     "Tuition covers most educational costs. However, families should budget for: Technology fee ($150/year, covers software licenses), Optional field trips and activities (varies, $50-200), Advanced Placement exam fees ($95 per exam), Some elective courses may have material fees (typically under $100), and Graduation expenses for seniors (cap/gown, yearbook). We provide a complete fee breakdown before enrollment.",
    //   category: "billing",
    // },

    // Student Life Category
    {
      id: 16,
      question: "How do students socialize in an online school?",
      answer:
        "We prioritize community building through: Virtual clubs (coding club, book club, art club, etc.), Weekly student meetups and social hours, Collaborative group projects, Online gaming tournaments, Student council and leadership opportunities, Virtual talent shows and events, and Annual in-person meetups (optional, in select regions). We believe social development is crucial and integrate it throughout our program.",
      category: "student-life",
    },
    {
      id: 17,
      question: "What extracurricular activities are available?",
      answer:
        "We offer a wide range of virtual extracurriculars: Robotics Club, Debate Team, Creative Writing Workshop, Virtual Art Studio, Music Theory and Composition, Coding and Game Development, Environmental Club, Student Newspaper, and Community Service Projects. Activities meet weekly and are led by passionate teacher-mentors. Students can join as many as they'd like at no additional cost.",
      category: "student-life",
    },
    {
      id: 18,
      question: "How do you support students with special needs?",
      answer:
        "We have a comprehensive Student Support Services team including: Special education coordinators, School counselors, Learning specialists, and ESL support. We provide: Individualized Education Plans (IEPs), Accommodations for various learning needs, Extended time on assignments and tests, Alternative assessment formats, and Regular check-ins with support staff. Contact our Student Support team to discuss your child's specific needs.",
      category: "student-life",
    },
    {
      id: 19,
      question: "How do you handle student assessments and progress reporting?",
      answer:
        "We use a multi-faceted assessment approach: Weekly quizzes to check understanding, Monthly progress reports with detailed feedback, Quarterly parent-teacher conferences, Comprehensive semester report cards, Portfolio-based assessments showing student growth, and Standardized testing three times per year. Parents can access real-time progress through the parent portal anytime.",
      category: "student-life",
    },
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category for category view
  const getFAQsByCategory = () => {
    if (activeCategory !== "all") {
      return { [activeCategory]: filteredFAQs };
    }

    return filteredFAQs.reduce(
      (acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      },
      {} as Record<string, FAQItem[]>,
    );
  };

  const faqsByCategory = getFAQsByCategory();

  return (
    <>
      <Navbar />

      <div className="faq-page">
        {/* Hero Section */}
        <section className="faq-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Frequently Asked Questions</h1>
              <p>
                Find answers to common questions about our e-learning school.
                Can't find what you're looking for? Contact our support team.
              </p>

              {/* Search Bar */}
              <div className="search-container">
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="clear-search"
                      onClick={() => setSearchTerm("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main FAQ Section */}
        <section className="faq-main">
          <div className="container">
            <div className="faq-layout">
              {/* Category Sidebar */}
              <aside className="faq-sidebar">
                <h3>Categories</h3>
                <ul className="category-list">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        {category.id !== "all" && (
                          <span className="category-count">
                            (
                            {
                              faqData.filter((f) => f.category === category.id)
                                .length
                            }
                            )
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Contact Info Card */}
                <div className="contact-card">
                  <h4>Still have questions?</h4>
                  <p>
                    Can't find the answer you're looking for? Our support team
                    is here to help.
                  </p>
                  <div className="contact-options">
                    <a href="tonjame974@gmail.com" className="contact-item">
                      <span className="contact-icon">✉️</span>
                      tonjame974@gmail.com
                    </a>
                    <a href="tel:+18005550123" className="contact-item">
                      <span className="contact-icon">📞</span>
                      +254 770 428297
                    </a>
                    <div className="contact-item">
                      <span className="contact-icon">💬</span>
                      Live Chat: 24/7
                    </div>
                  </div>
                  <Link to="/contact" className="contact-btn">
                    Contact Support
                  </Link>
                </div>
              </aside>

              {/* FAQ Content Area */}
              <main className="faq-content-area">
                {/* Results Summary */}
                <div className="results-header">
                  <p className="results-count">
                    {filteredFAQs.length}{" "}
                    {filteredFAQs.length === 1 ? "result" : "results"} found
                  </p>
                  {activeCategory !== "all" && (
                    <button
                      className="clear-category"
                      onClick={() => setActiveCategory("all")}
                    >
                      Clear filter
                    </button>
                  )}
                </div>

                {/* FAQ Items by Category */}
                {Object.entries(faqsByCategory).map(([category, faqs]) => (
                  <div key={category} className="faq-category-group">
                    {activeCategory === "all" && (
                      <h2 className="category-heading">
                        {categories.find((c) => c.id === category)?.icon}{" "}
                        {categories.find((c) => c.id === category)?.name}
                      </h2>
                    )}

                    <div className="faq-list">
                      {faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className={`faq-item ${activeId === faq.id ? "active" : ""}`}
                        >
                          <button
                            className="faq-question"
                            onClick={() => toggleFAQ(faq.id)}
                          >
                            <span className="question-text">
                              {faq.question}
                            </span>
                            <span className="faq-icon">
                              {activeId === faq.id ? "−" : "+"}
                            </span>
                          </button>
                          <div className="faq-answer">
                            <p>{faq.answer}</p>
                            {faq.category === "technical" && (
                              <div className="answer-actions">
                                <a href="#!" className="action-link">
                                  📚 View Tech Guides
                                </a>
                                <a href="#!" className="action-link">
                                  💬 Start Live Chat
                                </a>
                              </div>
                            )}
                            {faq.category === "admissions" && (
                              <div className="answer-actions">
                                <Link
                                  to="/auth/register"
                                  className="action-link"
                                >
                                  📝 Start Application
                                </Link>
                                <a href="#!" className="action-link">
                                  📞 Schedule Consultation
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* No Results State */}
                {filteredFAQs.length === 0 && (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No questions found</h3>
                    <p>
                      We couldn't find any questions matching "{searchTerm}".
                      Try different keywords or browse by category.
                    </p>
                    <button
                      className="clear-btn"
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("all");
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>

        {/* Still Need Help Section */}
        {/* <section className="help-section">
          <div className="container">
            <div className="help-content">
              <h2>Still Need Help?</h2>
              <p>
                Our dedicated support team is available 24/7 to assist you with
                any questions.
              </p>
              <div className="help-options">
                <Link to="/contact" className="help-card">
                  <div className="help-icon">📧</div>
                  <h4>Email Us</h4>
                  <p>Get a response within 24 hours</p>
                </Link>
                <Link to="/chat" className="help-card">
                  <div className="help-icon">💬</div>
                  <h4>Live Chat</h4>
                  <p>Instant support from our team</p>
                </Link>
                <Link to="/resources" className="help-card">
                  <div className="help-icon">📚</div>
                  <h4>Resource Center</h4>
                  <p>Guides, tutorials, and more</p>
                </Link>
              </div>
            </div>
          </div>
        </section> */}
      </div>

      <Footer />
    </>
  );
};

export default FAQs;
