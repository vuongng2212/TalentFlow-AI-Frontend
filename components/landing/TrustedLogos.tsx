import React from 'react';

export const TrustedLogos: React.FC = () => {
  const logos = [
    { name: 'Novaware', letter: 'N' },
    { name: 'Cloudkit', letter: 'C' },
    { name: 'Axiom Data', letter: 'A' },
    { name: 'Runway Ops', letter: 'R' },
    { name: 'Helios AI', letter: 'H' },
  ];

  // Duplicate the logos to create a seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-10 border-y border-slate-100 bg-slate-50/50 dark:border-zinc-900 dark:bg-zinc-950/20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="text-center text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
          Trusted by high-growth talent teams
        </p>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_10%,black_90%,transparent_100%)]">
          <div className="flex w-max animate-infinite-scroll py-2 gap-12 sm:gap-20 items-center justify-around">
            {duplicatedLogos.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 font-jakarta font-extrabold text-lg text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors duration-300 select-none cursor-default"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-200/60 dark:bg-zinc-800/60 font-black text-slate-600 dark:text-zinc-400 text-xs">
                  {logo.letter}
                </span>
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedLogos;
