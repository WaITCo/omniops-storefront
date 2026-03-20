'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractHeadings(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]) as 2 | 3;
    const id = match[2] ?? match[3].replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const text = match[3].replace(/<[^>]+>/g, '');
    if (text) items.push({ id, level, text });
  }
  return items;
}

interface Props {
  content: string;
}

export function BlogToc({ content }: Props) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="sticky top-24 bg-white border border-muted rounded-2xl p-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-4">
        Inhalt
      </p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={[
                'block text-sm leading-snug transition-colors py-1',
                level === 3 ? 'pl-4' : '',
                activeId === id
                  ? 'text-accent font-medium'
                  : 'text-foreground/50 hover:text-foreground',
              ].join(' ')}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
