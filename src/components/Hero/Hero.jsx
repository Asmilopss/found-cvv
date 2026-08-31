
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-badge">✨ Campus Lost & Found Portal</div>

        <h1 className="hero-title">
          <span className="line1">Find What's Lost.</span>
          <br />
          <span className="line2">Return What's Found.</span>
        </h1>

        <p className="hero-description">
          A secure digital platform for the CVV community to report, search, and
          recover lost belongings quickly using university accounts.
        </p>

        <div className="hero-buttons">
          <Link to="/login">
            <button className="btn btn-primary">Login →</button>
          </Link>

          <a href="#how-it-works" className="btn btn-secondary">
            See How It Works ↓
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;