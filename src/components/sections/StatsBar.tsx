import { getTranslations } from 'next-intl/server';

interface Props {
  locale: string;
}

export async function StatsBar({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const stats = [
    { value: '12.400+', label: t('stats.learners') },
    { value: '85', label: t('stats.products') },
    { value: '4,9 ★', label: t('stats.rating') },
    { value: '∞', label: t('stats.access') },
  ];

  return (
    <section className="border-y border-muted bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-muted">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-8 px-6 text-center">
              <p className="font-serif text-3xl text-foreground font-bold">{value}</p>
              <p className="font-mono text-xs text-foreground/50 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
