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
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="faq-q text-left font-bold text-gray-900 dark:text-white"
              onClick={() => toggle(index)}
              style={{ cursor: 'pointer' }}
            >
              <span>{item.question}</span>
              <span className="text-xl">{isOpen ? '−' : '+'}</span>
            </button>
            <div
              className={`faq-a text-sm text-gray-600 dark:text-gray-400 transition-all duration-300 ${
                isOpen ? 'block' : 'hidden'
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
