interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={[
        'bg-background border border-muted',
        hover ? 'transition-shadow hover:shadow-md cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
