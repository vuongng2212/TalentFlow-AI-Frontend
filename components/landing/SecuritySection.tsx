import React from "react";
import SectionHeader from "./SectionHeader";

export const SecuritySection: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up" id="security">
      <div className="landing-container">
        <SectionHeader
          chip="Enterprise Grade"
          title="Security & Compliance"
          subtitle="Designed for recruiting teams that need speed, explainability, and governance without compromising on security."
          centered={true}
        />

        <div className="grid-3" style={{ marginTop: "32px" }}>
          <div className="card pad">
            <span className="badge closed">SOC 2 Type II</span>
            <h3 style={{ marginTop: "12px" }}>Enterprise Security</h3>
            <p>
              Our infrastructure is SOC 2 Type II certified. All candidate and
              workspace data is encrypted at rest and in transit using
              enterprise-grade protocols.
            </p>
          </div>

          <div className="card pad">
            <span className="badge applied">GDPR Ready</span>
            <h3 style={{ marginTop: "12px" }}>Data Privacy</h3>
            <p>
              Full compliance with GDPR and CCPA. Configure custom data
              retention policies and fully automate candidate data deletion
              workflows.
            </p>
          </div>

          <div className="card pad">
            <span className="badge open">Audit Trails</span>
            <h3 style={{ marginTop: "12px" }}>Governance & Logs</h3>
            <p>
              Maintain a comprehensive audit history for role changes, candidate
              exports, billing events, automations, and AI scoring overrides.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
