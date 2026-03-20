import { getTranslations } from 'next-intl/server';

interface Props {
  locale: string;
}

const FEATURE_ICONS = [
  // Blitz / Sofortzugang
  <svg key="access" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
  // Schild / Garantie
  <svg key="guarantee" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  // Menschen / Community
  <svg key="community" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>,
];

export async function HomepageFeatures({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const features = [
    { key: 'access', icon: FEATURE_ICONS[0] },
    { key: 'guarantee', icon: FEATURE_ICONS[1] },
    { key: 'community', icon: FEATURE_ICONS[2] },
  ] as const;

  return (
    <section className="bg-gray-50 border-t border-muted py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ key, icon }) => (
            <div key={key} className="bg-white border border-muted rounded-2xl p-8">
              <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center text-foreground mb-5">
                {icon}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                {t(`features.${key}.title` as `features.access.title`)}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {t(`features.${key}.desc` as `features.access.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
