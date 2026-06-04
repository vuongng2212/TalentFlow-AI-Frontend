import React from 'react';
import Accordion from '../ui/accordion';

export const FaqSection: React.FC = () => {
  const faqItems = [
    {
      question: "How does AI scoring work?",
      answer:
        "Scores compare resume evidence to the job requirements and show matched skills, gaps, and confidence notes.",
    },
    {
      question: "Can hiring managers use a lighter workspace?",
      answer:
        "Yes. Interviewers see interviews, candidate dossiers, feedback tasks, and relevant jobs without admin surfaces.",
    },
    {
      question: "Do admins get audit history?",
      answer:
        "Workspace admins can review role changes, exports, billing events, automations, and AI override history.",
    },
    {
      question: "Can we customize pipeline stages?",
      answer:
        "Each job can reorder stages, add review steps, and map automations to stage movement.",
    },
    {
      question: "Does it support bulk CV upload?",
      answer:
        "Bulk upload, email ingestion, and job-board ingestion are supported in Plus and Business plans.",
    },
    {
      question: "Can recruiters override the AI?",
      answer:
        "Yes. Overrides are first-class and kept in the audit trail with notes and timestamps.",
    },
  ];

  return (
    <section className="landing-section" data-faq>
      <div className="landing-container grid-2">
        <div>
          <h2>FAQ</h2>
          <p style={{ marginTop: "8px" }}>
            Designed for recruiting teams that need speed, explainability,
            and governance.
          </p>
        </div>
        <div className="card pad">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
