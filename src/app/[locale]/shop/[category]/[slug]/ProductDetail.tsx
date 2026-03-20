'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { CurriculumAccordion } from '@/components/product/CurriculumAccordion';
import type { Product } from '@/lib/strapi-types';

interface Props {
  product: Product;
  categorySlug: string;
  currency?: string;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-yellow-600">{rating.toFixed(1)}</span>
      <span className="text-sm text-foreground/50">({count.toLocaleString('de-DE')} Bewertungen)</span>
    </div>
  );
}

const MOCK_REVIEWS = [
  { name: 'Anna M.', stars: 5, text: 'Absolut empfehlenswert! Die Inhalte sind klar strukturiert und sofort anwendbar.' },
  { name: 'Thomas K.', stars: 5, text: 'Genau das, was ich gesucht habe. Sehr professionell und praxisnah.' },
  { name: 'Lisa S.', stars: 4, text: 'Sehr guter Kurs, ich habe viel gelernt. Kleine Abzüge für die Audioqualität.' },
];

export function ProductDetail({ product, categorySlug, currency = 'EUR' }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const activeVariants = product.variants?.filter((v) => v.is_active) ?? [];
  const selectedVariant = activeVariants[0] ?? null;
  const lowestPrice = selectedVariant?.price ?? null;

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(cents / 100);

  const discountPercent =
    product.originalPrice && lowestPrice && product.originalPrice > lowestPrice
      ? Math.round((1 - lowestPrice / product.originalPrice) * 100)
      : null;

  const [addedToCart, setAddedToCart] = useState(false);

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      productId: product.documentId,
      productName: product.name,
      variantId: selectedVariant.documentId,
      variantLabel: '',
      price: selectedVariant.price,


    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const coverImage = product.images?.[0];
  const primaryCategory = product.categories?.[0]?.name ?? categorySlug;

  return (
    <div>
      {/* Hero-Band */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
            <div className="mb-8 lg:mb-0">
              <nav className="flex items-center gap-2 font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
                <Link href="/shop" className="hover:text-white/70 transition-colors">Shop</Link>
                <span>/</span><span>{primaryCategory}</span>
                {product.level && <><span>/</span><span>{product.level}</span></>}
              </nav>
              {product.badge && (
                <div className="mb-4">
                  {product.badge === 'BESTSELLER' && <span className="inline-block bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Bestseller</span>}
                  {product.badge === 'NEU' && <span className="inline-block bg-white/15 text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full">Neu</span>}
                  {product.badge === 'SALE' && <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Sale</span>}
                </div>
              )}
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-4">{product.name}</h1>
              {product.short_description && (
                <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-xl">{product.short_description}</p>
              )}
              {product.rating !== null && product.ratingCount !== null && product.rating > 0 && (
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating!) ? 'text-yellow-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-yellow-400 font-semibold text-sm">{product.rating.toFixed(1)}</span>
                  <span className="text-white/50 text-sm">({product.ratingCount.toLocaleString('de-DE')})</span>
                  {product.enrollment && <span className="text-white/50 text-sm ml-2">· {product.enrollment.toLocaleString('de-DE')} Lernende</span>}
                </div>
              )}
              {product.instructor && (
                <div className="flex items-center gap-3 mt-6">
                  {product.instructorAvatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={`${strapiUrl}${product.instructorAvatar.url}`} alt={product.instructor} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {product.instructor.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Dozent</p>
                    <p className="text-white font-medium text-sm">{product.instructor}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Main Content + Sticky Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="space-y-12">
            {/* Was du lernst */}
            {product.whatYouLearn && product.whatYouLearn.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-foreground mb-6">Was du lernst</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            {product.curriculum && product.curriculum.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-4">
                  <h2 className="font-serif text-2xl text-foreground">Kursinhalt</h2>
                  <span className="font-mono text-xs text-foreground/40">
                    {product.numSections ? `${product.numSections} Abschnitte · ` : ''}
                    {product.numLessons ? `${product.numLessons} Lektionen · ` : ''}
                    {product.videoDuration ?? ''}
                  </span>
                </div>
                <CurriculumAccordion
                  curriculum={product.curriculum}
                  labels={{ showAll: 'Alle {count} weiteren Abschnitte anzeigen', showLess: 'Weniger anzeigen', freePreview: 'Gratis Vorschau' }}
                />
              </section>
            )}

            {/* Voraussetzungen */}
            {product.requirements && product.requirements.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-foreground mb-4">Voraussetzungen</h2>
                <ul className="space-y-2">
                  {product.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0 mt-2" />
                      <span className="text-sm text-foreground/70">{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Dozenten-Profil */}
            {product.instructor && (
              <section>
                <h2 className="font-serif text-2xl text-foreground mb-6">Über den Dozenten</h2>
                <div className="flex items-start gap-5">
                  {product.instructorAvatar ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={`${strapiUrl}${product.instructorAvatar.url}`} alt={product.instructor} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-xl flex-shrink-0">
                      {product.instructor.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground text-lg mb-1">{product.instructor}</p>
                    <div className="flex flex-wrap gap-4 font-mono text-xs text-foreground/40 mb-3">
                      <span>★ 4,9 Dozenten-Bewertung</span><span>12.400+ Lernende</span><span>8 Kurse</span>
                    </div>
                    {product.instructorBio && <p className="text-sm text-foreground/70 leading-relaxed">{product.instructorBio}</p>}
                  </div>
                </div>
              </section>
            )}

            {/* Bewertungen */}
            <section>
              <div className="flex items-end gap-4 mb-6">
                <h2 className="font-serif text-2xl text-foreground">Bewertungen</h2>
                {product.rating !== null && product.ratingCount !== null && product.rating > 0 && (
                  <StarRating rating={product.rating} count={product.ratingCount} />
                )}
              </div>
              <div className="space-y-5">
                {MOCK_REVIEWS.map(({ name, stars, text }) => (
                  <div key={name} className="border border-muted rounded-xl p-5 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 text-sm font-bold">{name.slice(0,1)}</div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{name}</p>
                        <div className="flex">{[1,2,3,4,5].map((s) => <svg key={s} className={`w-3.5 h-3.5 ${s<=stars?'text-yellow-400':'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky-Kauf-Karte */}
          <div>
            <div className="sticky top-24 bg-white border border-muted rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                {coverImage && <Image src={`${strapiUrl}${coverImage.url}`} alt={product.name} fill className="object-cover opacity-80" />}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  {lowestPrice !== null && <span className="font-mono font-bold text-2xl text-foreground">{formatPrice(lowestPrice)}</span>}
                  {product.originalPrice && lowestPrice && product.originalPrice > lowestPrice && (
                    <span className="font-mono text-foreground/40 line-through text-base">{formatPrice(product.originalPrice)}</span>
                  )}
                  {discountPercent && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">-{discountPercent}%</span>}
                </div>
                <p className="font-mono text-xs text-accent mb-5">⏱ Nur noch kurze Zeit zu diesem Preis</p>
                <div className="space-y-3 mb-6">
                  <Link href="/checkout" className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-mono font-semibold text-sm py-3 rounded-lg transition-colors">
                    Jetzt kaufen
                  </Link>
                  <button onClick={handleAddToCart} className="block w-full text-center border border-foreground text-foreground hover:bg-foreground hover:text-background font-mono font-semibold text-sm py-3 rounded-lg transition-colors">
                    {addedToCart ? '✓ Im Warenkorb' : 'Zum Warenkorb'}
                  </button>
                </div>
                <p className="flex items-center gap-2 text-xs text-foreground/50 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  30 Tage Geld-zurück-Garantie
                </p>
                <ul className="space-y-2 text-sm text-foreground/60">
                  {product.videoDuration && <li className="flex items-center gap-2"><svg className="w-4 h-4 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>{product.videoDuration} Video</li>}
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3" /></svg>Mobile & Desktop-Zugang</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Zertifikat nach Abschluss</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>Lebenslanger Zugang</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
