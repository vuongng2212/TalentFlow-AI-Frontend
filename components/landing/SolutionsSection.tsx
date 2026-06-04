import React from "react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { solutions } from "./data";

export const SolutionsSection = () => {
  return (
    <section className="landing-section" id="solutions">
      <div className="landing-container grid-2">
        <div>
          <SectionHeader
            chip="AI ✦ Guided demo"
            title="Preview the recruiting flow before entering the app."
            subtitle="The demo follows one role from CV intake to a scored shortlist, then hands off to the interactive dashboard only after the viewer understands they are opening a product preview."
          />
          <Link className="btn secondary mt-5 inline-flex" href="/dashboard">
            Open dashboard preview
          </Link>
        </div>
        <div className="card pad">
          <div className="list">
            {solutions.map((solution, index) => {
              return (
                <p key={solution.id}>
                  <strong>{index + 1}. {solution.title}:</strong> {solution.description}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
