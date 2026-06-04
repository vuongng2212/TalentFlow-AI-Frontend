import React from 'react';

export const TrustedLogos: React.FC = () => {
  return (
    <section
      className="py-12 border-b border-slate-200 bg-white overflow-hidden"
    >
      <div className="landing-container overflow-hidden">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
          Trusted by modern talent teams
        </p>
        <div className="flex gap-16 items-center justify-center flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <span className="w-8 h-8 rounded bg-slate-200 text-slate-600 flex items-center justify-center">N</span>
            Novaware
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <span className="w-8 h-8 rounded bg-slate-200 text-slate-600 flex items-center justify-center">C</span>
            Cloudkit
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <span className="w-8 h-8 rounded bg-slate-200 text-slate-600 flex items-center justify-center">A</span>
            Axiom Data
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <span className="w-8 h-8 rounded bg-slate-200 text-slate-600 flex items-center justify-center">R</span>
            Runway Ops
          </div>
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <span className="w-8 h-8 rounded bg-slate-200 text-slate-600 flex items-center justify-center">H</span>
            Helios AI
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedLogos;