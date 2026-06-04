import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="landing-nav">
      <div className="landing-nav-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">TF</span> TalentFlow AI
        </Link>
        <nav>
          <a
            href="#features"
            className="hover:text-purple-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="hover:text-purple-600 transition-colors"
          >
            Pricing
          </a>
          <a href="#how" className="hover:text-purple-600 transition-colors">
            How it works
          </a>
        </nav>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link className="btn secondary" href="/login">
            Login
          </Link>
          <Link className="btn primary" href="/signup">
            Start Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
