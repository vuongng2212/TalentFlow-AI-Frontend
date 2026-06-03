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
    <div className="space-y-0">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`faq-item border-b border-gray-200 dark:border-gray-800 last:border-b-0 ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className={`faq-q w-full py-4 text-left font-bold transition-colors duration-200 flex justify-between items-center ${isOpen ? 'text-primary dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}
              onClick={() => toggle(index)}
              style={{ cursor: 'pointer' }}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className={`text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-45 text-primary' : 'rotate-0 text-gray-400'}`}>+</span>
            </button>
            <div
              className={`faq-a text-sm text-gray-600 dark:text-gray-400 transition-all duration-300 overflow-hidden ${
                isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0'
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
