import React from "react";
import { features } from "./data";
import SectionHeader from "./SectionHeader";

export default function FeaturesSection() {
  return (
    <section className="landing-section animate-fade-in-up" id="features">
      <div className="landing-container">
        <div className="grid-3">
          {features.map((feature, index) => (
            <div className="card pad" key={index}>
              <span className={`badge ${feature.badgeStyle}`}>
                {feature.badgeText}
              </span>
              <h3 style={{ marginTop: "12px" }}>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
