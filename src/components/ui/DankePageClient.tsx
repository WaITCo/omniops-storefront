'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Konfetti } from '@/components/ui/Konfetti';

export function DankePageClient() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // small delay so CSS transitions fire after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <Konfetti delay={400} />

      <div className="mx-auto max-w-2xl">
        {/* Success Hero */}
        <div className="text-center mb-10">
          {/* Animated success circle */}
          <div className="inline-flex items-center justify-center relative mb-8">
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-full bg-accent/20"
              style={{
                animation: visible ? 'pulseRing 2s ease-out infinite' : 'none',
              }}
            />
            {/* Main circle */}
            <span
              className="relative w-24 h-24 rounded-full bg-foreground flex items-center justify-center"
              style={{
                animation: visible ? 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0)',
              }}
            >
              <svg
                className="w-12 h-12 text-background"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>

          <h1
            className="font-serif text-4xl sm:text-5xl text-foreground mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.1s',
            }}
          >
            Kauf erfolgreich!
          </h1>

          <p
            className="text-foreground/60 text-lg"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.2s',
            }}
          >
            Danke für dein Vertrauen. Eine Bestätigung wurde an deine E-Mail-Adresse gesendet.
          </p>
        </div>

        {/* Bestellübersicht Card */}
        <div
          className="bg-white border border-muted rounded-2xl p-6 mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            transitionDelay: '0.3s',
          }}
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-4">
            Bestellübersicht
          </h2>

          <div className="flex items-start gap-4 pb-4 border-b border-muted mb-4">
            {/* Produkt-Thumbnail */}
            <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-accent/20 to-foreground/10" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                FORMA Meisterkurs: Digitales Produktdesign
              </p>
              <p className="text-sm text-foreground/50 mt-0.5">Design · Fortgeschritten</p>
              <a
                href="#"
                className="text-sm text-accent hover:underline mt-1 inline-block"
              >
                Zugang öffnen →
              </a>
            </div>
          </div>

          {/* Preis */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>Nettobetrag</span>
              <span>74,79 €</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Mehrwertsteuer (19 %)</span>
              <span>14,21 €</span>
            </div>
            <div className="flex justify-between font-semibold text-foreground text-base pt-2 border-t border-muted mt-2">
              <span>Gesamt</span>
              <span>89,00 €</span>
            </div>
          </div>

          {/* Bestellnummer */}
          <p className="text-xs text-foreground/40 mt-4">
            Bestellnummer: <span className="font-mono">#FORMA-2024-001</span>
          </p>
        </div>

        {/* Nächste Schritte Card */}
        <div
          className="bg-white border border-muted rounded-2xl p-6 mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            transitionDelay: '0.4s',
          }}
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-5">
            Nächste Schritte
          </h2>

          <div className="space-y-4">
            {[
              { step: 1, title: 'Zugang öffnen', desc: 'Dein Kurs ist sofort verfügbar – starte jetzt.' },
              { step: 2, title: 'Community beitreten', desc: 'Tausch dich mit anderen Lernenden aus.' },
              { step: 3, title: 'Kurs starten', desc: 'Lerne in deinem eigenen Tempo, wann immer du willst.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-foreground text-background font-mono text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-foreground/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease',
            transitionDelay: '0.5s',
          }}
        >
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Weitere Produkte entdecken
            </Button>
          </Link>
          <Link
            href="/meine-kaeufe"
            className="text-sm text-foreground/60 hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Zu meinen Käufen
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
