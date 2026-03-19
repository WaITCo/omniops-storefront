type Variant = 'default' | 'success' | 'warning' | 'error';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-foreground text-background',
  success: 'bg-green-700 text-white',
  warning: 'bg-accent text-white',
  error: 'bg-red-700 text-white',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block font-mono text-xs uppercase tracking-wider px-2 py-0.5',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
