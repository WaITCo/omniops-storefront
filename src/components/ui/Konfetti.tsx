'use client';

import { useEffect } from 'react';
import type { Options } from 'canvas-confetti';

// Dynamic import to avoid SSR issues
async function fireKonfetti() {
  const confetti = (await import('canvas-confetti')).default;

  const options: Options = {
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: [
      '#D4622A', // FORMA accent (Terrakotta)
      '#FAFAF9', // FORMA background (Creme)
      '#1A1A18', // FORMA foreground
      '#E8E6E1', // FORMA muted
    ],
  };

  confetti(options);
}

interface KonfettiProps {
  /** Delay in ms before firing (default: 300) */
  delay?: number;
}

export function Konfetti({ delay = 300 }: KonfettiProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fireKonfetti();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return null;
}
