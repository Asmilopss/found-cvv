import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <a href="#hero" className="logo">
        found@cvv
      </a>
      {/* Navigation */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>
        </li>

        <li>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>
        </li>

        <li>
          <a href="#faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>
        </li>
      </ul>

      {/* Right Side */}
      <div className="nav-actions">
        {/* Desktop Login */}
        <Link to="/register" className="login-btn">
          Sign Up 
        </Link>

     

        {/* Mobile Menu */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
