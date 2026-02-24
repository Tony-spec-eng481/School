import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <h3 className="text-xl font-bold mb-4">Trespics School</h3>
        <p className="mb-4 text-gray-400">
          Empowering minds, shaping futures with excellence in education.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          <a href="#" className="text-gray-400 hover:text-white">
            Facebook
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            Twitter
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            Instagram
          </a>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Trespics School. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

/* Footer CSS Styles */
<style>{`
  .footer {
    background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
    color: white;
    padding: 60px 0 30px;
    margin-top: auto;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .text-center {
    text-align: center;
  }

  .text-xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .mb-8 {
    margin-bottom: 2rem;
  }

  .text-gray-400 {
    color: #9ca3af;
  }

  .text-gray-500 {
    color: #6b7280;
  }

  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .gap-4 {
    gap: 1rem;
  }

  /* Hover effect */
  .text-gray-400:hover {
    color: white;
    transition: color 0.3s ease;
  }

  /* Link styles */
  .footer a {
    text-decoration: none;
    font-weight: 500;
    position: relative;
  }

  .footer a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    transition: width 0.3s ease;
  }

  .footer a:hover::after {
    width: 100%;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .footer {
      padding: 40px 0 20px;
    }

    .text-xl {
      font-size: 1.25rem;
    }

    .flex {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0 16px;
    }

    .text-sm {
      font-size: 0.75rem;
    }
  }
`}</style>;
