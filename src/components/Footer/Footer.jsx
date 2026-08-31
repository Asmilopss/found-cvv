import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            found<span>@cvv</span>
          </Link>

          <p className="footer-description">
            A secure campus lost-and-found portal helping the CVV community
            report, find, and recover lost belongings.
          </p>
        </div>


        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <button onClick={() => scrollToSection("features")}>
            Features
          </button>

          <button onClick={() => scrollToSection("how-it-works")}>
            How It Works
          </button>

          <button onClick={() => scrollToSection("faq")}>
            FAQ
          </button>

          <Link to="/login">
            Login
          </Link>
        </div>


        {/* Get Started */}
        <div className="footer-action">
          <h3>Ready to get started?</h3>

          <p>
            Sign in with your university account to access Found@CVV.
          </p>

          <Link to="/login" className="footer-button">
            Login →
          </Link>
        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © 2026 Found@CVV. All rights reserved.
        </p>

        <p>
          Built for the CVV Community
        </p>
      </div>
    </footer>
  );
}

export default Footer;