'use client';

import React, { useState } from 'react';

export default function WelcomeHeader() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (!showWelcome) return null;

  return (
    <div className="card pad" style={{ marginBottom: '18px' }}>
      <div className="page-head" style={{ margin: 0 }}>
        <div>
          <h1 className="text-2xl font-bold">Good morning, Avery.</h1>
          <p>Seven high-fit candidates need review before the Platform hiring sync.</p>
        </div>
        <button
          className="btn secondary"
          onClick={() => setShowWelcome(false)}
          style={{ cursor: 'pointer' }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
