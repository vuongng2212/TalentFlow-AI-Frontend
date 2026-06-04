import React from 'react';
import Link from 'next/link';
import { navItems } from './data';

export const Header: React.FC = () => {
  return (
    <header className="landing-nav">
      <div className="landing-nav-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">TF</span> TalentFlow AI
        </Link>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-purple-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
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
