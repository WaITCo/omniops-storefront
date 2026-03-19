import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
        Werkzeuge,
        <br />
        die wirken.
      </h1>
      <p className="mt-6 font-sans text-lg text-foreground/70 max-w-xl">
        FORMA – Der Demo-Shop für omniops-os.
      </p>
      <p className="mt-2 font-mono text-sm text-foreground/40">
        {t('loading')}
      </p>
    </section>
  );
}
