import React from "react";
import Image from "next/image";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "We cut the first review loop from two days to one morning, and the score explanation made hiring managers trust the shortlist.",
      author: "Ari Lane",
      role: "VP People",
      company: "Novaware",
      avatar: "https://i.pravatar.cc/150?u=ari"
    },
    {
      quote: "The candidate dossier changed our interview prep. Interviewers arrive with evidence instead of resume guesses.",
      author: "Priya Raman",
      role: "Eng Director",
      company: "Cloudkit",
      avatar: "https://i.pravatar.cc/150?u=priya"
    },
    {
      quote: "Admin can finally see automation, roles, exports, and billing without asking recruiting ops for a spreadsheet.",
      author: "Marcus Ito",
      role: "COO",
      company: "Axiom Data",
      avatar: "https://i.pravatar.cc/150?u=marcus"
    }
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
            Success Stories
          </span>
          <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
            Loved by recruitment teams
          </h2>
        </div>

        {/* Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Decorative Quote Mark */}
              <div className="absolute top-4 left-6 text-6xl font-serif text-indigo-100 dark:text-indigo-950 select-none pointer-events-none z-0">
                &ldquo;
              </div>

              {/* Quote Text */}
              <p className="relative z-10 text-[14px] leading-relaxed font-medium text-slate-700 dark:text-zinc-300 italic pt-6">
                {t.quote}
              </p>

              {/* Author Info */}
              <div className="relative z-10 flex items-center gap-3.5 mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                {/* Image Avatar replacing Initials */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                  <Image src={t.avatar} alt={t.author} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="font-jakarta text-xs font-bold text-slate-900 dark:text-zinc-50 leading-tight">
                    {t.author}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                      {t.role}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
                    <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 tracking-wide uppercase">
                      {t.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
