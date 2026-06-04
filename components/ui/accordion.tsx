'use client';

import React, { useState } from 'react';

export interface AccordionProps {
  items: { question: string; answer: string }[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="group py-2 first:pt-0 last:pb-0">
            <button
              type="button"
              className="w-full py-4 text-left font-semibold text-slate-900 hover:text-primary transition-colors duration-200 flex justify-between items-center gap-4 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
              onClick={() => toggle(index)}
              style={{ cursor: 'pointer' }}
              aria-expanded={isOpen}
            >
              <span className="text-[15px] sm:text-base leading-snug">{item.question}</span>
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-primary/5 transition-colors duration-200">
                <svg
                  className={`w-3 h-3 text-slate-400 group-hover:text-primary transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0 pb-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
