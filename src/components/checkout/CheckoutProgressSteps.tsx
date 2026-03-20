import { useTranslations } from 'next-intl';

interface Step {
  number: number;
  labelKey: string;
  state: 'completed' | 'active' | 'upcoming';
}

export function CheckoutProgressSteps() {
  const t = useTranslations('checkout.progress');

  const steps: Step[] = [
    { number: 1, labelKey: 'cart', state: 'completed' },
    { number: 2, labelKey: 'payment', state: 'active' },
    { number: 3, labelKey: 'confirmation', state: 'upcoming' },
  ];

  return (
    <div className="border-b border-muted bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center justify-center gap-0">
          {steps.map((step, index) => (
            <li key={step.number} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <div
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    step.state === 'completed'
                      ? 'bg-foreground text-background'
                      : step.state === 'active'
                        ? 'bg-foreground text-background'
                        : 'border-2 border-muted text-foreground/30',
                  ].join(' ')}
                  aria-current={step.state === 'active' ? 'step' : undefined}
                >
                  {step.state === 'completed' ? (
                    /* Checkmark SVG */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={[
                    'font-mono text-xs uppercase tracking-wider',
                    step.state === 'active'
                      ? 'text-foreground font-semibold'
                      : step.state === 'completed'
                        ? 'text-foreground/60'
                        : 'text-foreground/30',
                  ].join(' ')}
                >
                  {t(step.labelKey)}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={[
                    'mx-3 mb-5 h-px w-16 sm:w-24 transition-colors',
                    step.state === 'completed' ? 'bg-foreground/40' : 'bg-muted',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
