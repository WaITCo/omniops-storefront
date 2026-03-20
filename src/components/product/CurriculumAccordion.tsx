'use client';

import { useState } from 'react';
import type { CurriculumItem } from '@/lib/strapi-types';

interface Props {
  curriculum: CurriculumItem[];
  labels: { showAll: string; showLess: string; freePreview: string };
}

export function CurriculumAccordion({ curriculum, labels }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? curriculum : curriculum.slice(0, 5);

  if (!curriculum.length) return null;

  return (
    <div>
      <div className="border border-muted rounded-xl overflow-hidden divide-y divide-muted">
        {visible.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
              {item.isFree ? (
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.isFree && (
                <span className="text-xs text-accent border border-accent/30 rounded-full px-2 py-0.5">
                  {labels.freePreview}
                </span>
              )}
              {item.duration && (
                <span className="font-mono text-xs text-foreground/40">{item.duration}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {curriculum.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full text-center font-mono text-sm text-foreground/50 hover:text-foreground transition-colors py-2"
        >
          {expanded
            ? labels.showLess
            : labels.showAll.replace('{count}', String(curriculum.length - 5))}
        </button>
      )}
    </div>
  );
}
