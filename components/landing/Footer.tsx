import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="landing-section"
      style={{ paddingTop: "24px", borderTop: "1px solid var(--border)" }}
    >
      <div
        className="landing-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" className="logo">
          <span className="logo-mark">TF</span> TalentFlow AI
        </Link>
        <p>Product · Security · Pricing · Support © 2026 TalentFlow AI</p>
      </div>
    </footer>
  );
}
