'use client';

import { useState } from 'react';
import type { FaqSection } from '@/lib/strapi-types';

interface FaqProps {
  section: FaqSection;
}

export function Faq({ section }: FaqProps) {
  const { items } = section;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="divide-y divide-muted border-t border-b border-muted">
        {items.map((item, i) => (
          <div key={item.id}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="font-sans font-medium text-foreground group-hover:text-accent transition-colors">
                {item.question}
              </span>
              <span className="font-mono text-foreground/60 ml-4 flex-shrink-0 transition-transform duration-200"
                style={{ transform: openIndex === i ? 'rotate(45deg)' : 'none' }}>
                +
              </span>
            </button>
            {openIndex === i && (
              <div className="pb-5">
                <p className="font-sans text-foreground/70 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
