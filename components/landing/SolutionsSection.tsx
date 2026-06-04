import React from "react";
import Link from "next/link";

export const SolutionsSection = () => {
  return (
    <section className="landing-section" id="demo-tour">
      <div className="landing-container grid-2">
        <div>
          <span className="chip ai-chip">AI ✦ Guided demo</span>
          <h2 style={{ marginTop: "14px" }}>
            Preview the recruiting flow before entering the app.
          </h2>
          <p style={{ marginTop: "10px" }}>
            The demo follows one role from CV intake to a scored shortlist,
            then hands off to the interactive dashboard only after the
            viewer understands they are opening a product preview.
          </p>
          <Link
            className="btn secondary mt-5 inline-flex"
            href="/dashboard"
          >
            Open dashboard preview
          </Link>
        </div>
        <div className="card pad shadow-sm bg-white border border-slate-100">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                1
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Intake</h4>
                <p className="text-slate-600 text-sm">Upload resumes and normalize candidate facts automatically.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                2
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Evidence</h4>
                <p className="text-slate-600 text-sm">Review AI fit, skill matches, gaps, and confidence notes.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                3
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Pipeline</h4>
                <p className="text-slate-600 text-sm">Move candidates through screening, interviews, offer, or rejection with audit context intact.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
